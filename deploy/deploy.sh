#!/usr/bin/env bash
# Copy the site to the Hong Kong server. Run on your Mac after each update:
#   deploy/deploy.sh <server IP>
# Only the files browsers need are sent; secrets (config.local.js), the
# Supabase sources, docs and Git data stay on your Mac.
set -euo pipefail

IP="${1:?用法: deploy/deploy.sh <服务器IP>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

rsync -avz --delete \
  --exclude '.*' \
  --exclude '/config.local.js' --exclude '/config.example.js' \
  --exclude '/supabase/' --exclude '/deploy/' \
  --exclude '*.md' --exclude '/books.tsv' \
  "$ROOT/" "root@${IP}:/srv/bookshelf/"

echo "已上传到 ${IP}:/srv/bookshelf"
