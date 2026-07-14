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

| Method | Path                | Body                                                        | Returns                               |
|--------|---------------------|-------------------------------------------------------------|---------------------------------------|
| POST   | /auth/register      | `{ email, password, displayName? }`                         | `{ user, accessToken, refreshToken }` |
| POST   | /auth/login         | `{ email, password }`                                       | `{ user, accessToken, refreshToken }` |
| POST   | /auth/refresh       | `{ refreshToken }`                                          | `{ accessToken, refreshToken }`       |
| POST   | /auth/google        | `{ idToken }`                                               | `{ user, accessToken, refreshToken }` |
| POST   | /auth/apple         | `{ identityToken, rawNonce, fullName? }`                    | `{ user, accessToken, refreshToken }` |
| POST   | /auth/forgot-password | `{ email }`                                               | `{ message }`                         |
| GET    | /auth/me            | —                                                           | `{ user }`                            |
| POST   | /uploads/presign    | `{ fileName, contentType }`                                 | `{ uploadUrl, fileKey }`              |
| POST   | /try-on             | `{ personKey, garmentKey }`                                 | `{ jobId, status }`                   |
| GET    | /try-on/:jobId      | —                                                           | `{ jobId, status, resultUrl?, error?}`|
| GET    | /try-on             | —                                                           | `{ items: TryOnJob[] }`               |

### Verifying social sign-in server-side

**Google** — the mobile app sends the `id_token` it received from Google.
Verify it against Google's JWKS (`https://www.googleapis.com/oauth2/v3/certs`)
with `audience` set to your **Web** OAuth client ID. Then upsert the user
by `sub` (Google user id) and email, and return your own JWTs.

**Apple** — the mobile app sends the `identityToken` from
`expo-apple-authentication` plus the unhashed `rawNonce`. Verify the JWT
against Apple's JWKS (`https://appleid.apple.com/auth/keys`) with
`audience = "ai.mirror.app"` (your bundle identifier), and confirm that
`sha256(rawNonce) === identityToken.nonce`. `fullName` is only supplied
on first sign-in — persist it then, because Apple never sends it again.

### Forgot password

`POST /auth/forgot-password` should **always return success** (even for an
email that isn't registered) and email a reset link/token if the account
exists — never let this endpoint reveal whether an email is registered.
The app doesn't yet implement the token-confirmation screen (the page the
reset link opens); that's a separate deep-link route to add once the
backend defines the token format.

## Environment

The `EXPO_PUBLIC_*` vars in `.env` are inlined into the JS bundle. Only
put public identifiers there — never secrets. Google OAuth *client IDs*
are safe (they identify your app, not authenticate it); Google/Apple
client *secrets* and the Replicate API token belong on the NestJS side.
