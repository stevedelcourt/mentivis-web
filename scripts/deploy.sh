#!/bin/bash
set -e

PROD=0
VERCEL=0
while [[ $# -gt 0 ]]; do
  case $1 in
    --prod) PROD=1 ;;
    --vercel) VERCEL=1 ;;
  esac
  shift
done

# FTP creds (sc4 default, sc3 if --prod)
if [ $PROD -eq 1 ]; then
  FTP_HOST=sc3bovu7233.universe.wf
  FTP_USER=sc3bovu7233
else
  FTP_HOST=sc4bovu7233.universe.wf
  FTP_USER=sc4bovu7233
fi
FTP_PASSWORD=RoxanStevenMathias2024

echo "🚀 Deploying mentivis-web..."

# Git
git add -A
git commit -m "Deploy $(date +"%Y-%m-%d %H:%M")" --allow-empty
git push origin main

# Manual Vercel (optional)
if [ $VERCEL -eq 1 ]; then
  vercel --prod
fi

# FTP
npm run build:ftp
FTP_HOST=$FTP_HOST FTP_USER=$FTP_USER FTP_PASSWORD=$FTP_PASSWORD python3 scripts/ftp_sync.py

echo "✅ Done"
