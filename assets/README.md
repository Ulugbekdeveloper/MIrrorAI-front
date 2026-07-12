# Assets

Static assets bundled into the app. Referenced from code with `require()` or
from `app.json` with relative paths.

## Layout

```
assets/
├── brand/     App icon, splash, adaptive icon — referenced from app.json
├── icons/     UI icons (SVG/PNG) if you outgrow @expo/vector-icons
└── images/    In-app illustrations, onboarding, sample garments, hero images
```

## Brand assets (required for a real build)

When you're ready to build with EAS, add these and wire them in `app.json`:

| File                          | Size          | Purpose                                     |
|-------------------------------|---------------|---------------------------------------------|
| `brand/icon.png`              | 1024×1024     | iOS + fallback app icon                     |
| `brand/adaptive-icon.png`     | 1024×1024     | Android adaptive icon foreground (transparent margin around a ~66% safe zone) |
| `brand/splash.png`            | 1284×2778     | Splash screen (portrait, will be centered)  |
| `brand/favicon.png`           | 48×48         | Web favicon                                 |

Then in `app.json`:

```json
"icon": "./assets/brand/icon.png",
"splash": {
  "image": "./assets/brand/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#0B0B0F"
},
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/brand/adaptive-icon.png",
    "backgroundColor": "#0B0B0F"
  }
},
"web": { "favicon": "./assets/brand/favicon.png" }
```

Until then, Expo uses default placeholders — that's why `adaptiveIcon` is
currently omitted from `app.json`.

## Using images in code

```tsx
import { Image } from 'expo-image';

<Image source={require('@/../assets/images/hero.png')} style={{ width: 200, height: 200 }} />
```

Metro resolves `require()` paths statically at bundle time and inlines the
asset — never construct paths dynamically at runtime.
