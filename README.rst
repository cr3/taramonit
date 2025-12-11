taraMonit
=========

Status page.

Setup
-----

docker compose run --rm -p 80:80 -p 443:443 certbot certonly --standalone --non-interactive --agree-tos --deploy-hook /deploy-hook.sh -d status.taram.ca
