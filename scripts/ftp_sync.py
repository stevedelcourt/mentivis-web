#!/usr/bin/env python3
import os
import sys
import ftplib
import socket

socket.setdefaulttimeout(30)

REMOTE_HOST = os.environ.get("FTP_HOST")
REMOTE_USER = os.environ.get("FTP_USER")
REMOTE_PASS = os.environ.get("FTP_PASSWORD")
REMOTE_ROOT = os.environ.get("FTP_ROOT", "public_html")
LOCAL_ROOT = os.environ.get("LOCAL_ROOT", "out")

ALLOWED_EXTS = {
    ".html", ".js", ".css", ".json", ".png", ".jpg", ".svg", ".webp", ".avif",
    ".txt", ".xml", ".gz", ".pdf", ".ico", ".woff2", ".woff", ".ttf",
    ".eot", ".webmanifest",
}


def is_allowed(f):
    if f in (".htaccess",):
        return True
    return os.path.splitext(f)[1].lower() in ALLOWED_EXTS


def connect():
    ftp = ftplib.FTP(REMOTE_HOST, REMOTE_USER, REMOTE_PASS)
    ftp.cwd(REMOTE_ROOT)
    return ftp


def reset_to(ftp):
    try:
        ftp.cwd(REMOTE_ROOT)
    except Exception:
        try:
            ftp.cwd("/")
            ftp.cwd(REMOTE_ROOT)
        except Exception:
            pass


def upload_file(ftp, local_path, remote_path, retries=2):
    dirname = os.path.dirname(remote_path)
    basename = os.path.basename(remote_path)

    if dirname:
        reset_to(ftp)
        for p in dirname.split("/"):
            try:
                ftp.cwd(p)
            except Exception:
                try:
                    ftp.mkd(p)
                    ftp.cwd(p)
                except Exception:
                    pass
    else:
        reset_to(ftp)

    if not basename:
        return True, "skipped (no basename)"

    last_err = None
    for attempt in range(retries + 1):
        try:
            with open(local_path, "rb") as fh:
                ftp.storbinary(f"STOR {basename}", fh)
            return True, None
        except ftplib.error_perm as e:
            err = str(e)
            if "Is a directory" in err or "File is a directory" in err:
                try:
                    ftp.delete(basename)
                except Exception:
                    try:
                        ftp.rmd(basename)
                    except Exception:
                        pass
                try:
                    with open(local_path, "rb") as fh:
                        ftp.storbinary(f"STOR {basename}", fh)
                    return True, None
                except Exception as e2:
                    last_err = str(e2)
                    continue
            last_err = err
        except Exception as e:
            last_err = str(e)

    return False, last_err


def upload_tree(ftp, local_root):
    files_to_upload = []
    for root, dirs, files in os.walk(local_root):
        for f in sorted(files):
            if f.startswith(".") and f != ".htaccess":
                continue
            local_rel = os.path.relpath(os.path.join(root, f), local_root)
            if local_rel.startswith("__next"):
                continue
            if not is_allowed(f):
                continue
            local_path = os.path.join(local_root, local_rel)
            files_to_upload.append((local_path, local_rel))

    total = len(files_to_upload)
    count = 0
    failed = []

    for idx, (local_path, local_rel) in enumerate(files_to_upload, 1):
        success, err = upload_file(ftp, local_path, local_rel)
        if success:
            count += 1
            print(f"  {count:3d}/{total}: {local_rel}")
        else:
            failed.append((local_rel, err))
            print(f"  FAIL: {local_rel} — {err}", file=sys.stderr)

    return count, total, failed


def verify_css(ftp):
    """Check that all referenced CSS files in HTML actually exist on server."""
    try:
        ftp.cwd(f"{REMOTE_ROOT}/_next/static/chunks")
        remote_files = set(ftp.nlst())
        css_missing = []
        for root, dirs, files in os.walk(LOCAL_ROOT):
            for f in files:
                if not f.endswith(".html"):
                    continue
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                for line in content.splitlines():
                    if "_next/static/chunks/" in line and ".css" in line:
                        for part in line.split("_next/static/chunks/")[1:]:
                            css_name = part.split('"')[0].split("'")[0].split(">")[0]
                            if css_name.endswith(".css") and css_name not in remote_files:
                                css_missing.append(css_name)
        if css_missing:
            print(f"\n  WARNING: {len(css_missing)} CSS files referenced but missing on server:", file=sys.stderr)
            for c in set(css_missing):
                print(f"    - {c}", file=sys.stderr)
        else:
            print(f"\n  CSS verification: all referenced CSS files present on server.")
    except Exception as e:
        print(f"\n  CSS verification skipped: {e}")


if __name__ == "__main__":
    print("Connecting...")
    ftp = connect()
    print(f"Connected to {REMOTE_HOST}, root={REMOTE_ROOT}")

    count, total, failed = upload_tree(ftp, LOCAL_ROOT)

    if failed:
        print(f"\nRetrying {len(failed)} failed files...")
        still_failed = []
        for local_rel, err in failed:
            local_path = os.path.join(LOCAL_ROOT, local_rel)
            success, err2 = upload_file(ftp, local_path, local_rel, retries=3)
            if success:
                count += 1
                print(f"  RETRY OK: {local_rel}")
            else:
                still_failed.append((local_rel, err2))
                print(f"  RETRY FAIL: {local_rel} — {err2}", file=sys.stderr)
        failed = still_failed

    verify_css(ftp)

    ftp.quit()

    if failed:
        print(f"\nDone: {count}/{total} files uploaded. {len(failed)} failures:", file=sys.stderr)
        for f, e in failed:
            print(f"  - {f}: {e}", file=sys.stderr)
        sys.exit(1)
    else:
        print(f"\nDone: {count}/{total} files uploaded successfully.")
        sys.exit(0)
