# Lessons

- 2026-06-12: Treat `C:\BMO`, `C:\barmatrix-app`, and `C:\barmatrix-api` as the BarMatrix product lineage and implementation surfaces. `C:\ABM` is a rebuild/reference source unless a task explicitly asks to pull marketing copy from it.
- 2026-06-26: The old no-discount README rule is superseded for the current `HALFOFF499` campaign. Treat the approved 50% off sale as pay-in-full only unless a newer task explicitly adds discounted split-pay support.
- 2026-06-26: For BarMatrix launch operations, check `C:\Users\JesusLovesMe\.env` by key names before assuming provider credentials are unavailable, and use Hostinger SSH plus `~/secrets/barmatrix-api.env` for live API/Stripe proof. Never print secret values.
