# Mirror AI — Frontend

React Native (Expo) app for the Mirror AI virtual clothing try-on product.

## Architecture

```
Mobile App (Expo / RN)
       │  HTTPS + Bearer
       ▼
NestJS Gateway
       │
   ┌───┴────┬─────────┐
   ▼        ▼         ▼
  Auth   Uploads   Try-On ──► Replicate (IDM-VTON)
   │        │         │
   ▼        ▼         ▼
PostgreSQL  S3     ClickHouse (events)
```

The mobile app never talks to Replicate directly — the API token stays on
the server. The app requests presigned S3 PUT URLs, uploads the person +
garment photos, then asks the gateway to start a try-on job and polls
until it's done.

## Layout

```
app/           expo-router routes (file-based)
  (auth)/       login, register
  (app)/        home, history, try-on/*

src/
  api/         typed HTTP client + endpoint modules
  config/      env
  features/    feature-specific hooks + components
  lib/         SecureStore, permissions, logger
  stores/      Zustand (auth)
  theme/       colors, spacing, typography
  ui/          reusable components
```

## Setup

```bash
npm install
cp .env.example .env      # then edit EXPO_PUBLIC_API_BASE_URL
npx expo install --check  # aligns native deps to the SDK
npm run ios               # or: npm run android
```

## Backend contract

The app codes against this contract — mirror it on the NestJS side:

| Method | Path                | Body                             | Returns                              |
|--------|---------------------|----------------------------------|--------------------------------------|
| POST   | /auth/register      | `{ email, password }`            | `{ user, accessToken, refreshToken }`|
| POST   | /auth/login         | `{ email, password }`            | `{ user, accessToken, refreshToken }`|
| POST   | /auth/refresh       | `{ refreshToken }`               | `{ accessToken, refreshToken }`      |
| GET    | /auth/me            | —                                | `{ user }`                           |
| POST   | /uploads/presign    | `{ fileName, contentType }`      | `{ uploadUrl, fileKey }`             |
| POST   | /try-on             | `{ personKey, garmentKey }`      | `{ jobId, status }`                  |
| GET    | /try-on/:jobId      | —                                | `{ jobId, status, resultUrl?, error?}`|
| GET    | /try-on             | —                                | `{ items: TryOnJob[] }`              |
