#!/usr/bin/env python3
import os
import ftplib
import socket

socket.setdefaulttimeout(20)

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


def upload_file(ftp, local_path, remote_path):
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

    if basename:
        try:
            with open(local_path, "rb") as fh:
                ftp.storbinary(f"STOR {basename}", fh)
            return True
        except ftplib.error_perm as e:
            err = str(e)
            if "Is a directory" in err or "File is a directory" in err:
                try:
                    ftp.delete(basename)
                except Exception:
                    try:
                        ftp.rmd(basename)
                    except Exception:
                        return False
                try:
                    with open(local_path, "rb") as fh:
                        ftp.storbinary(f"STOR {basename}", fh)
                    return True
                except Exception:
                    return False
            return False
        except Exception:
            return False
    return False


def upload_tree(ftp, local_root):
    count = 0
    for root, dirs, files in os.walk(local_root):
        for f in sorted(files):
            if f.startswith(".") and f != ".htaccess":
                continue
            local_rel = os.path.relpath(os.path.join(root, f), local_root)
            if local_rel.startswith("__next") or "/__next" in local_rel:
                continue
            if not is_allowed(f):
                continue

            remote_rel = local_rel
            local_path = os.path.join(local_root, local_rel)

            if upload_file(ftp, local_path, remote_rel):
                count += 1
                print(f"  {count:3d}: {local_rel} -> {remote_rel}")

    return count


if __name__ == "__main__":
    print("Connecting...")
    ftp = connect()
    print(f"Connected to {REMOTE_HOST}, root={REMOTE_ROOT}")
    count = upload_tree(ftp, LOCAL_ROOT)
    ftp.quit()
    print(f"Done: {count} files uploaded")
