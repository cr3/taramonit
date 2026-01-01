taraMonit
=========

.. image:: https://github.com/cr3/taramonit/workflows/test/badge.svg
       :target: https://github.com/cr3/taramonit/actions
.. image:: https://github.com/cr3/taramonit/workflows/deploy/badge.svg
       :target: https://status.taram.ca

Status page.

Setup
-----

docker compose run --rm -p 80:80 -p 443:443 certbot certonly --standalone --non-interactive --agree-tos --deploy-hook /deploy-hook.sh -d status.taram.ca
