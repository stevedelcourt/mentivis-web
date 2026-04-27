#!/usr/bin/env python3
import os
import ftplib
import json
import hashlib

REMOTE_HOST = 'sc4bovu7233.universe.wf'
REMOTE_USER = 'sc4bovu7233'
REMOTE_PASS = 'RoxanStevenMathias2024'
REMOTE_ROOT = 'public_html'
LOCAL_ROOT = '/Users/stv/Documents/zed/mentivis-glass/mentivis-web/out'
MANIFEST_PATH = '/Users/stv/Documents/zed/mentivis-glass/mentivis-web/.upload_manifest.json'

ALLOWED_EXTS = {'.html', '.js', '.css', '.json', '.png', '.jpg', '.svg', '.webp', '.txt', '.xml', '.gz', '.pdf', '.ico', '.woff2', '.woff', '.ttf', '.eot', '.png', '.webmanifest'}

def is_allowed(filename):
    if filename in ('.htaccess',):
        return True
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTS

def file_hash(path):
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()[:12]

def get_local_manifest():
    manifest = {}
    for root, dirs, files in os.walk(LOCAL_ROOT):
        for f in files:
            if is_allowed(f):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, LOCAL_ROOT)
                manifest[rel] = file_hash(full)
    return manifest

def connect():
    ftp = ftplib.FTP(REMOTE_HOST, REMOTE_USER, REMOTE_PASS)
    ftp.cwd(REMOTE_ROOT)
    return ftp

def ensure_dirs(ftp, rel_path):
    dirs = rel_path.rsplit('/', 1)[0] if '/' in rel_path else ''
    if not dirs:
        return
    parts = dirs.split('/')
    for p in parts:
        try:
            ftp.cwd(p)
        except:
            ftp.mkd(p)
            ftp.cwd(p)

def sync_to_remote():
    print('Scanning local files...')
    local_manifest = get_local_manifest()
    print(f'Local: {len(local_manifest)} files')

    prev_manifest = {}
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, 'r') as f:
            prev_manifest = json.load(f)
        print(f'Previous manifest: {len(prev_manifest)} files')

    remote_files = set()
    all_candidates = sorted(set(prev_manifest.keys()) | set(local_manifest.keys()))
    print('Checking which files exist remotely...')

    ftp = connect()
    for i in range(0, len(all_candidates), 50):
        batch = all_candidates[i:i+50]
        for rel_path in batch:
            try:
                if ftp.size(rel_path) is not None:
                    remote_files.add(rel_path)
            except:
                pass
        print(f'  {min(i+50, len(all_candidates))}/{len(all_candidates)}...')
    ftp.quit()
    print(f'Remote: {len(remote_files)} files')

    to_delete = sorted(set(prev_manifest.keys()) - set(local_manifest.keys()))
    if to_delete:
        print(f'\nDeleting {len(to_delete)} stale files...')
        for rel_path in to_delete:
            ftp = connect()
            dirs = rel_path.rsplit('/', 1)[0] if '/' in rel_path else ''
            if dirs:
                ensure_dirs(ftp, rel_path)
            try:
                ftp.delete(os.path.basename(rel_path))
                print(f'  Deleted {rel_path}')
            except Exception as e:
                print(f'  Failed: {rel_path} ({e})')
            ftp.quit()

    to_upload = {f for f in local_manifest
                 if f not in prev_manifest or prev_manifest[f] != local_manifest[f]}
    changed = sum(1 for f in to_upload if f in prev_manifest)
    new = sum(1 for f in to_upload if f not in prev_manifest)
    print(f'\nUploading {len(to_upload)} files ({changed} changed, {new} new)...')

    from collections import defaultdict
    by_toplevel = defaultdict(list)
    for rel_path in sorted(to_upload):
        top = rel_path.split('/')[0]
        by_toplevel[top].append(rel_path)

    for top, paths in sorted(by_toplevel.items()):
        ftp = connect()
        for rel_path in paths:
            ensure_dirs(ftp, rel_path)
            local_full = os.path.join(LOCAL_ROOT, rel_path)
            with open(local_full, 'rb') as f:
                ftp.storbinary(f'STOR {os.path.basename(rel_path)}', f)
            print(f'  {rel_path}')
        ftp.quit()

    with open(MANIFEST_PATH, 'w') as f:
        json.dump(local_manifest, f, indent=2)

    print(f'\nDone! Uploaded {len(to_upload)} files, deleted {len(to_delete)} stale files.')

if __name__ == '__main__':
    sync_to_remote()