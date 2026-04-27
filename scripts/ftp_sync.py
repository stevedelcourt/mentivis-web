#!/usr/bin/env python3
import os
import ftplib
import hashlib

REMOTE_HOST = os.environ.get("FTP_HOST")
REMOTE_USER = os.environ.get("FTP_USER")
REMOTE_PASS = os.environ.get("FTP_PASSWORD")
REMOTE_ROOT = os.environ.get("FTP_ROOT", "public_html")
LOCAL_ROOT = os.environ.get("LOCAL_ROOT", "out")

ALLOWED_EXTS = {
    ".html", ".js", ".css", ".json", ".png", ".jpg", ".svg", ".webp",
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


def reset_to(ftp, target):
    while ftp.pwd() != target:
        ftp.cwd("..")


def upload_tree(ftp, local_root):
    count = 0
    for root, dirs, files in os.walk(local_root):
        for f in sorted(files):
            if f.startswith("."):
                continue
            local_rel = os.path.relpath(os.path.join(root, f), local_root)
            if local_rel.startswith("__next") or "/__next" in local_rel:
                continue

            if not is_allowed(f):
                continue

            store_name = f[:-5] if f.endswith(".html") else f
            remote_rel = local_rel[:-5] if local_rel.endswith(".html") else local_rel

            if "/" in remote_rel:
                parts = remote_rel.rsplit("/", 1)
                subdir = parts[0]
                for p in subdir.split("/"):
                    try:
                        ftp.cwd(p)
                    except Exception:
                        try:
                            ftp.mkd(p)
                            ftp.cwd(p)
                        except Exception:
                            pass
                try:
                    with open(os.path.join(local_root, local_rel), "rb") as fh:
                        ftp.storbinary(f"STOR {store_name}", fh)
                    count += 1
                except Exception as e:
                    print(f"  ERROR {local_rel}: {e}")
                reset_to(ftp, REMOTE_ROOT)
            else:
                try:
                    with open(os.path.join(local_root, local_rel), "rb") as fh:
                        ftp.storbinary(f"STOR {store_name}", fh)
                    count += 1
                except Exception as e:
                    print(f"  ERROR {local_rel}: {e}")
    return count


if __name__ == "__main__":
    ftp = connect()
    count = upload_tree(ftp, LOCAL_ROOT)
    ftp.quit()
    print(f"Done: {count} files uploaded")
