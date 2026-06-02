# Dal dolore al fitness

Blog personale con area admin per:

- gestire tema e testi del sito
- scrivere, modificare ed eliminare articoli
- pubblicare bozze o contenuti finiti
- caricare immagini e video e inserirli negli articoli

## Stack

- Next.js App Router
- Prisma
- PostgreSQL
- autenticazione admin con cookie firmato
- Vercel Blob per i media in produzione

## Variabili ambiente

```bash
DATABASE_URL=
SESSION_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
BLOB_READ_WRITE_TOKEN=
```

## Avvio locale

1. Installa le dipendenze.
2. Configura il database PostgreSQL.
3. Esegui le migrazioni Prisma con `npx prisma migrate dev --name init`.
4. Avvia il progetto con `npm run dev`.

## Deploy su Vercel

1. Crea un progetto su Vercel collegato a questa cartella.
2. Aggiungi le variabili d'ambiente.
3. Collega un database PostgreSQL e Vercel Blob.
4. Esegui la prima migrazione sul database remoto.
5. Pubblica il progetto.

## Creazione hash password

Puoi generarlo con:

```bash
node scripts/hash-password.mjs "la-tua-password"
```

L'output va salvato in `ADMIN_PASSWORD_HASH`.

## Note Vercel

- Usa un database PostgreSQL esterno o Vercel Postgres.
- Usa Vercel Blob per mantenere persistenti immagini e video caricati.
- Il tema è modificabile dal pannello admin senza toccare il codice.
- Le bozze restano private: il sito pubblico mostra solo gli articoli pubblicati.
