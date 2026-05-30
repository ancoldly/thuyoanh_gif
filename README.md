# Graduation Invitation App

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Run SQL in `supabase/schema.sql`.
3. In Supabase Storage, create public bucket: `graduation-album`.
4. Run `npm install` then `npm run dev`.

## Routes
- `/` landing page invitation
- `/album` public album
- `/login` owner login
- `/album/manage` upload/manage album (protected)
