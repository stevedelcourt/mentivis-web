#!/bin/bash
# ftp_fast_deploy.sh — Déploiement rapide via lftp (mirror parallèle)
# Usage: ./scripts/ftp_fast_deploy.sh
# Pré-requis: brew install lftp

set -e

HOST="sc4bovu7233.universe.wf"
USER="sc4bovu7233"
PASS="RoxanStevenMathias2024"
REMOTE_DIR="/public_html"
LOCAL_DIR="out"

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ Dossier $LOCAL_DIR introuvable. Lance d'abord: npm run build:ftp"
  exit 1
fi

# Compter les fichiers
FILE_COUNT=$(find "$LOCAL_DIR" -type f | wc -l | tr -d ' ')
echo "🚀 Déploiement rapide lftp"
echo "   Source : $LOCAL_DIR/ ($FILE_COUNT fichiers)"
echo "   Cible  : ftp://$HOST$REMOTE_DIR/"
echo ""

# lftp avec mirror parallèle (10 connexions simultanées)
lftp -u "$USER,$PASS" "$HOST" <<EOF
set ssl:verify-certificate no
set net:timeout 10
set net:max-retries 3
set ftp:sync-mode off
set mirror:use-pget-n 5
set mirror:parallel-transfer-count 10
set mirror:parallel-directories yes
set ftp:list-options -a
set cmd:fail-exit yes

# Ouvrir le dossier distant
cd $REMOTE_DIR

# Supprimer les anciens fichiers HTML/JS/CSS pour éviter les stale chunks
glob rm -f *.html 2>/dev/null || true
glob rm -rf _next/static/chunks/app/* 2>/dev/null || true

# Mirror avec résumé
mirror --reverse --delete --verbose --parallel=10 "$LOCAL_DIR" .

bye
EOF

echo ""
echo "✅ Déploiement terminé"
