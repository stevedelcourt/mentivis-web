#!/usr/bin/env python3
"""Post-build script to sanitize bracket characters in Next.js static export.

Next.js generates directories like [lang] and [slug] for dynamic routes.
Some Apache/nginx configurations block URLs containing brackets (%5B / %5D).
This script renames those directories and updates all references.
"""

import os
import sys
import shutil
import re

OUT_DIR = "out"

# Map: old dir name → new dir name
REPLACEMENTS = {
    "[lang]": "lang",
    "[slug]": "slug",
}

# URL-encoded versions
ENCODED_REPLACEMENTS = {
    "%5Blang%5D": "lang",
    "%5Bslug%5D": "slug",
}

# File extensions to scan for text replacements
TEXT_EXTENSIONS = {
    ".html", ".js", ".css", ".json", ".txt", ".xml",
    ".map",  # source maps
}


def rename_bracket_dirs(root_dir):
    """Rename directories containing brackets."""
    renamed = []
    # Walk bottom-up so we can rename nested dirs after their parents
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        for dirname in dirnames:
            if dirname in REPLACEMENTS:
                old_path = os.path.join(dirpath, dirname)
                new_path = os.path.join(dirpath, REPLACEMENTS[dirname])
                if os.path.exists(new_path):
                    # Merge contents if target exists
                    print(f"  Merging {old_path} → {new_path}")
                    for item in os.listdir(old_path):
                        src = os.path.join(old_path, item)
                        dst = os.path.join(new_path, item)
                        if os.path.exists(dst):
                            if os.path.isdir(dst):
                                shutil.rmtree(dst)
                            else:
                                os.remove(dst)
                        shutil.move(src, dst)
                    os.rmdir(old_path)
                else:
                    print(f"  Renaming dir: {old_path} → {new_path}")
                    shutil.move(old_path, new_path)
                renamed.append((old_path, new_path))
    return renamed


def replace_in_file(filepath):
    """Replace encoded and literal bracket references in a file."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception as e:
        print(f"  Skip (read error): {filepath} — {e}")
        return 0

    original = content

    # Replace URL-encoded brackets in paths
    for old, new in ENCODED_REPLACEMENTS.items():
        content = content.replace(old, new)

    # Replace literal [lang] / [slug] only in chunk/static paths
    # Pattern: /_next/static/.../[lang]/ or similar
    for old, new in REPLACEMENTS.items():
        # Only replace when it looks like a path segment (preceded by /_next/static/)
        pattern = r'(/_next/static/[^"\'\s]*)' + re.escape(old)
        repl = r'\1' + new
        content = re.sub(pattern, repl, content)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return 1
    return 0


def scan_and_replace(root_dir):
    """Scan all files and replace bracket references."""
    modified = 0
    scanned = 0
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext in TEXT_EXTENSIONS or not ext:
                filepath = os.path.join(dirpath, filename)
                scanned += 1
                modified += replace_in_file(filepath)
    return scanned, modified


def main():
    if not os.path.isdir(OUT_DIR):
        print(f"Error: {OUT_DIR}/ directory not found. Run 'npm run build' first.")
        sys.exit(1)

    print("=== Sanitizing bracket characters in Next.js build ===")
    print()

    # Step 1: Rename directories
    print("Step 1: Renaming bracket directories...")
    renamed = rename_bracket_dirs(OUT_DIR)
    print(f"  Renamed {len(renamed)} directories")
    print()

    # Step 2: Replace references in files
    print("Step 2: Replacing bracket references in files...")
    scanned, modified = scan_and_replace(OUT_DIR)
    print(f"  Scanned {scanned} files, modified {modified}")
    print()

    print("=== Done ===")
    print("Bracket characters sanitized. Ready for FTP upload.")


if __name__ == "__main__":
    main()
