#!/usr/bin/env python3
"""Clean FTP deploy: delete old Next.js build files, then upload everything including __next files."""
import os
import sys
import ftplib
import socket
import time

socket.setdefaulttimeout(60)

REMOTE_HOST = os.environ.get("FTP_HOST", "sc4bovu7233.universe.wf")
REMOTE_USER = os.environ.get("FTP_USER", "sc4bovu7233")
REMOTE_PASS = os.environ.get("FTP_PASSWORD", "RoxanStevenMathias2024")
REMOTE_ROOT = os.environ.get("FTP_ROOT", "public_html")
LOCAL_ROOT = os.environ.get("LOCAL_ROOT", "out")

# Directories to DELETE from server (old build artifacts)
# NOTE: Never delete "_next" — o2switch CDN caches HTML referencing old chunks.
# Removing _next causes 404s on stale cached pages → React hydration error #418.
DELETE_DIRS = [
    "fr", "en", "404", "about", "admin", "_not-found",
    "site-images",
]

# Files to DELETE from server root
DELETE_FILES = [
    "index.html", "index", "404.html", "sitemap.xml", "llms.txt",
]

# NEVER touch these
PRESERVE = {
    ".htaccess", "robots.txt", "site.webmanifest",
    "favicon.ico", "favicon.png", "favicon-16x16.png", "favicon-32x32.png",
    "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png",
    "logo-noir.svg", "opengraph-image.jpg", "liquid-glass-filter.svg",
    "rapport-defense-mentivis-2026.avif", "rapport-defense-mentivis-2026.webp",
    "mentivis-solutions", "cgi-bin", "guide-images", "guide-pdf",
}

ALLOWED_EXTS = {
    ".html", ".js", ".css", ".json", ".png", ".jpg", ".svg", ".webp", ".avif",
    ".txt", ".xml", ".gz", ".pdf", ".ico", ".woff2", ".woff", ".ttf",
    ".eot", ".webmanifest", ".mp4", ".mp3", ".mov",
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


def rmdir_recursive(ftp, path):
    """Recursively delete a directory and its contents via FTP."""
    try:
        ftp.cwd(path)
    except:
        return False
    
    items = [i for i in ftp.nlst() if i not in ('.', '..')]
    for item in items:
        try:
            ftp.delete(item)
        except:
            try:
                ftp.cwd(item)
                ftp.cwd('..')
                rmdir_recursive(ftp, item)
            except:
                pass
    
    ftp.cwd('..')
    try:
        ftp.rmd(path)
        return True
    except:
        return False


def delete_old_files(ftp):
    print("\n=== PHASE 1: Deleting old build files ===")
    deleted_dirs = 0
    deleted_files = 0
    failed = []
    
    # Get current root listing
    root_items = set(ftp.nlst())
    
    # Delete directories
    for d in DELETE_DIRS:
        if d in root_items:
            print(f"  Deleting {d}/ ...")
            if rmdir_recursive(ftp, d):
                deleted_dirs += 1
                print(f"    ✅ Deleted")
            else:
                failed.append(d)
                print(f"    ❌ Failed")
        else:
            print(f"  {d}/ not found, skipping")
    
    reset_to(ftp)
    
    # Delete files
    for f in DELETE_FILES:
        if f in root_items:
            try:
                ftp.delete(f)
                deleted_files += 1
                print(f"  ✅ Deleted {f}")
            except Exception as e:
                failed.append(f)
                print(f"  ❌ Failed to delete {f}: {e}")
        else:
            print(f"  {f} not found, skipping")
    
    print(f"\nPhase 1 complete: {deleted_dirs} dirs, {deleted_files} files deleted")
    if failed:
        print(f"  Failed: {failed}")
    return failed


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
        return True, None
    
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


def format_size(bytes):
    if bytes > 1024*1024:
        return f"{bytes/(1024*1024):.1f} MB"
    elif bytes > 1024:
        return f"{bytes/1024:.1f} KB"
    return f"{bytes} B"


def upload_all(ftp, local_root):
    print("\n=== PHASE 2: Uploading all files (including __next) ===")
    
    files_to_upload = []
    total_size = 0
    for root, dirs, files in os.walk(local_root):
        for f in sorted(files):
            if f.startswith(".") and f != ".htaccess":
                continue
            local_rel = os.path.relpath(os.path.join(root, f), local_root)
            if not is_allowed(f):
                continue
            local_path = os.path.join(local_root, local_rel)
            size = os.path.getsize(local_path)
            files_to_upload.append((local_path, local_rel, size))
            total_size += size
    
    total = len(files_to_upload)
    print(f"  Total files: {total} ({format_size(total_size)})")
    
    # Sort: small files first, videos last
    videos = [(p, r, s) for p, r, s in files_to_upload if '/videos/' in r]
    others = [(p, r, s) for p, r, s in files_to_upload if '/videos/' not in r]
    # Sort others by size (smallest first)
    others.sort(key=lambda x: x[2])
    files_to_upload = others + videos
    
    count = 0
    failed = []
    uploaded_size = 0
    start_time = time.time()
    
    for idx, (local_path, local_rel, size) in enumerate(files_to_upload, 1):
        success, err = upload_file(ftp, local_path, local_rel)
        if success:
            count += 1
            uploaded_size += size
            elapsed = time.time() - start_time
            speed = uploaded_size / elapsed if elapsed > 0 else 0
            
            if size > 5*1024*1024:  # > 5MB
                print(f"  [{count:4d}/{total}] {local_rel} ({format_size(size)}) ✅")
            elif idx % 50 == 0 or idx == total:
                pct = uploaded_size / total_size * 100
                print(f"  Progress: {count}/{total} ({pct:.1f}%) — {format_size(speed)}/s")
        else:
            failed.append((local_rel, err))
            print(f"  FAIL: {local_rel} — {err}", file=sys.stderr)
    
    return count, total, failed, uploaded_size, time.time() - start_time


def main():
    start = time.time()
    print(f"Connecting to {REMOTE_HOST}...")
    ftp = connect()
    print(f"Connected. Root: {REMOTE_ROOT}")
    
    # Phase 1: Delete
    delete_old_files(ftp)
    
    # Phase 2: Upload
    count, total, failed, uploaded_size, upload_time = upload_all(ftp, LOCAL_ROOT)
    
    ftp.quit()
    
    total_time = time.time() - start
    print(f"\n{'='*50}")
    print(f"DEPLOY COMPLETE")
    print(f"  Uploaded: {count}/{total} files ({format_size(uploaded_size)})")
    print(f"  Upload time: {upload_time:.1f}s")
    print(f"  Total time: {total_time:.1f}s")
    if failed:
        print(f"  Failed: {len(failed)} files")
        for f, err in failed[:10]:
            print(f"    - {f}: {err}")
    print(f"{'='*50}")
    
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
