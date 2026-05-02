#!/usr/bin/env python3
"""Clean up old _next/static files on FTP server that are not in the current build."""
import os
import sys
import ftplib

LOCAL_ROOT = "out"
REMOTE_STATIC = "public_html/_next/static"

def get_local_files():
    """Get all files in out/_next/static/ as relative paths from _next/static."""
    static_dir = os.path.join(LOCAL_ROOT, "_next", "static")
    files = set()
    for root, dirs, filenames in os.walk(static_dir):
        for f in filenames:
            rel = os.path.relpath(os.path.join(root, f), static_dir)
            files.add(rel.replace(os.sep, "/"))
    return files

def get_remote_files(ftp, path=""):
    """Recursively list all files on FTP server under the current static dir."""
    files = []
    current = ftp.pwd()
    try:
        ftp.cwd(path)
    except Exception:
        return files

    try:
        items = ftp.nlst()
    except ftplib.error_perm:
        ftp.cwd(current)
        return files

    for item in items:
        if item in (".", ".."):
            continue
        try:
            ftp.cwd(item)
            # It's a directory
            ftp.cwd("..")
            files.extend(get_remote_files(ftp, item))
        except ftplib.error_perm:
            # It's a file
            # Store path relative to the static root
            abs_path = f"{ftp.pwd()}/{item}".replace("//", "/")
            rel_path = abs_path.replace(REMOTE_STATIC + "/", "", 1)
            files.append(rel_path)
        except Exception:
            pass

    ftp.cwd(current)
    return files

def main():
    local_files = get_local_files()
    print(f"Local static files: {len(local_files)}")

    ftp = ftplib.FTP("sc4bovu7233.universe.wf")
    ftp.login("sc4bovu7233", "RoxanStevenMathias2024")

    remote_files = get_remote_files(ftp, REMOTE_STATIC)
    print(f"Remote static files: {len(remote_files)}")

    to_delete = []
    for rf in remote_files:
        if rf not in local_files:
            to_delete.append(rf)

    print(f"Files to delete: {len(to_delete)}")

    if not to_delete:
        print("Nothing to clean up.")
        ftp.quit()
        return

    # Show first 30
    for f in sorted(to_delete)[:30]:
        print(f"  - {f}")
    if len(to_delete) > 30:
        print(f"  ... and {len(to_delete) - 30} more")

    # Confirm and delete
    print("\nDeleting files...")
    deleted = 0
    failed = []

    # Sort by depth (deepest first) to handle files before dirs if needed
    for rf in sorted(to_delete, key=lambda x: x.count("/"), reverse=True):
        remote_path = f"{REMOTE_STATIC}/{rf}"
        try:
            ftp.delete(remote_path)
            deleted += 1
            if deleted % 50 == 0:
                print(f"  Deleted {deleted}/{len(to_delete)}")
        except Exception as e:
            failed.append((rf, str(e)))

    print(f"\nDone. Deleted: {deleted}, Failed: {len(failed)}")
    if failed:
        print("Failed deletions:")
        for f, err in failed[:10]:
            print(f"  {f}: {err}")

    ftp.quit()

if __name__ == "__main__":
    main()
