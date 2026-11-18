#!/usr/bin/env bash
# One-time setup of the Hong Kong server (Ubuntu 22.04 / 24.04).
# Run on your Mac:   deploy/setup-server.sh <server IP> <domain>
# It logs in as root (you may be asked for the server password), installs
# Caddy, writes its config for your domain, then copies the site up.
set -euo pipefail

IP="${1:?用法: deploy/setup-server.sh <服务器IP> <域名>}"
DOMAIN="${2:?用法: deploy/setup-server.sh <服务器IP> <域名>}"
DOMAIN="${DOMAIN#www.}"
HERE="$(cd "$(dirname "$0")" && pwd)"

sed "s/__DOMAIN__/${DOMAIN}/g" "$HERE/Caddyfile" | ssh "root@${IP}" 'cat > /tmp/Caddyfile.new'

ssh "root@${IP}" 'bash -s' <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg rsync
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' -o /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddy
fi
mkdir -p /srv/bookshelf
caddy validate --adapter caddyfile --config /tmp/Caddyfile.new
mv /tmp/Caddyfile.new /etc/caddy/Caddyfile
systemctl enable caddy
systemctl reload caddy || systemctl restart caddy
echo "Caddy is running."
REMOTE

"$HERE/deploy.sh" "$IP"
echo
echo "完成。几分钟内 https://${DOMAIN} 会拿到证书并可以访问。"
