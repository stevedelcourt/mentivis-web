#!/bin/bash
# deploy_sc3_ssh.sh — Déploiement production (sc3) via SSH + rsync
# Usage: ./scripts/deploy_sc3_ssh.sh [--dry-run] [--skip-build]
#
# Flags:
#   --dry-run     Show what rsync would do without making changes
#   --skip-build  Skip npm run build:ftp, use existing out/ directory

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# --- Parse flags ---
DRY_RUN=0
SKIP_BUILD=0
for arg in "$@"; do
  case $arg in
    --dry-run)    DRY_RUN=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
  esac
done

# --- Source credentials ---
ENV_FILE="$PROJECT_DIR/.env.local"
if [ -f "$ENV_FILE" ]; then
  eval "$(grep -E '^FTP_HOST_PROD=|^FTP_USER_PROD=|^FTP_PASSWORD_PROD=' "$ENV_FILE" | sed 's/export //')"
fi

HOST="${FTP_HOST_PROD:-sc3bovu7233.universe.wf}"
USER="${FTP_USER_PROD:-sc3bovu7233}"
PASS="${FTP_PASSWORD_PROD:-}"
REMOTE_DIR="/home/$USER/public_html"

# --- Auth helper ---
ssh_cmd() {
  if command -v sshpass &> /dev/null && [ -n "$PASS" ]; then
    sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$USER@$HOST" "$@"
  else
    ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$USER@$HOST" "$@"
  fi
}

rsync_cmd() {
  local extra_args=""
  if [ "$DRY_RUN" -eq 1 ]; then
    extra_args="--dry-run"
  fi

  if command -v sshpass &> /dev/null && [ -n "$PASS" ]; then
    rsync -avz --delete $extra_args \
      --exclude='_next/' \
      --exclude='admin/' \
      --exclude='mentivis-solutions/' \
      --exclude='guide-images/' \
      --exclude='guide-pdf/' \
      --exclude='.DS_Store' \
      -e "sshpass -p $PASS ssh -o StrictHostKeyChecking=no" \
      "$PROJECT_DIR/out/" "$USER@$HOST:$REMOTE_DIR/"
  else
    rsync -avz --delete $extra_args \
      --exclude='_next/' \
      --exclude='admin/' \
      --exclude='mentivis-solutions/' \
      --exclude='guide-images/' \
      --exclude='guide-pdf/' \
      --exclude='.DS_Store' \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$PROJECT_DIR/out/" "$USER@$HOST:$REMOTE_DIR/"
  fi
}

# --- Step 1: Build ---
if [ "$SKIP_BUILD" -eq 0 ]; then
  echo "🔨 Building for FTP..."
  npm run build:ftp
else
  echo "⏭️  Skipping build (using existing out/)"
fi

# --- Step 2: Verify out/ exists ---
if [ ! -d "out" ]; then
  echo "❌ out/ directory not found. Run: npm run build:ftp"
  exit 1
fi

# --- Step 3: Remove admin from local out/ ---
if [ -d "out/admin" ]; then
  echo "🗑️  Removing out/admin/ (not needed on production)"
  rm -rf out/admin
fi

# --- Step 4: Test SSH connection ---
echo "🔌 Testing SSH connection to $HOST..."
if ! ssh_cmd "echo 'SSH OK'" > /dev/null 2>&1; then
  echo "❌ Cannot connect to $HOST via SSH"
  echo "   Check credentials in .env.local or SSH access on o2switch"
  exit 1
fi

# --- Step 5: Dry run or deploy ---
if [ "$DRY_RUN" -eq 1 ]; then
  echo ""
  echo "🔍 DRY RUN — showing what would change:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  rsync_cmd
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "✅ Dry run complete. No changes were made."
  echo "   Remove --dry-run to deploy for real."
  exit 0
fi

# --- Step 6: Confirmation ---
echo ""
echo "⚠️  Deploying to PRODUCTION (sc3):"
echo "   Host: $HOST"
echo "   Remote: $REMOTE_DIR/"
echo ""
read -p "   Continue? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Cancelled."
  exit 0
fi

# --- Step 7: Clean admin on server ---
echo ""
echo "🗑️  Removing admin/ from server..."
ssh_cmd "rm -rf $REMOTE_DIR/admin" 2>/dev/null || true

# --- Step 8: rsync ---
echo ""
echo "🚀 Deploying via rsync..."
START_TIME=$(date +%s)
rsync_cmd
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "✅ Production deploy complete in ${DURATION}s"
echo "   Verify: https://$HOST/"
echo "   💡 Clear browser cache if you see stale content"
