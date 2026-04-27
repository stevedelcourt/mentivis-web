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


def file_hash(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:12]


def connect():
    ftp = ftplib.FTP(REMOTE_HOST, REMOTE_USER, REMOTE_PASS)
    ftp.cwd(REMOTE_ROOT)
    return ftp


def ensure_dirs(ftp, rel):
    dirs = rel.rsplit("/", 1)[0] if "/" in rel else ""
    if not dirs:
        return
    for p in dirs.split("/"):
        try:
            ftp.cwd(p)
        except Exception:
            ftp.mkd(p)
            ftp.cwd(p)


manifest = {}
for root, dirs, files in os.walk(LOCAL_ROOT):
    for f in files:
        if is_allowed(f):
            full = os.path.join(root, f)
            manifest[os.path.relpath(full, LOCAL_ROOT)] = file_hash(full)

print(f"Local: {len(manifest)} files")

ftp = connect()

remote_files = set()
for rel in sorted(manifest.keys()):
    try:
        if ftp.size(rel) is not None:
            remote_files.add(rel)
    except Exception:
        pass
print(f"Remote: {len(remote_files)} files")

to_delete = sorted(set(manifest.keys()) - set(manifest.keys()))
for rel in to_delete:
    try:
        ftp.delete(rel)
        print(f"  Deleted {rel}")
    except Exception:
        pass

to_upload = {f for f in manifest}
print(f"Uploading {len(to_upload)} files...")
for rel in sorted(to_upload):
    ensure_dirs(ftp, rel)
    with open(os.path.join(LOCAL_ROOT, rel), "rb") as f:
        ftp.storbinary(f"STOR {os.path.basename(rel)}", f)
    print(f"  {rel}")

ftp.quit()
print("Done!")
