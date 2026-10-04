[README.md](https://github.com/user-attachments/files/33024786/README.md)
# TOR Bank — Full Platform Foundation

Frontend + защищённый API-каркас. Операции в этой сборке работают только в sandbox и не переводят реальные деньги.

## Запуск API
cd backend
npm install
cp .env.example .env
npm run dev

## Production перед реальными деньгами
- production authentication + MFA/passkeys
- KYC/AML и screening
- core banking и double-entry ledger
- card processing/acquiring
- СБП integration
- PostgreSQL
- HSM/KMS и секреты вне Git
- antifraud, rate limits, idempotency
- audit logs, monitoring, backups, disaster recovery
- security testing/pentest и необходимые юридические процессы

GitHub Pages подходит для frontend, но секреты и production API туда помещать нельзя.
