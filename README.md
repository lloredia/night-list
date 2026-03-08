# 🌙 Night List

> **Get On The List.**

Night List is a two-sided nightlife booking platform — giving club owners and promoters a powerful management dashboard, and guests a premium visual table booking experience.

---

## Repo Structure

```
night-list/
├── prototype/          # Interactive React UI prototype (run in browser)
├── ios/                # SwiftUI iOS app — NightList.app
└── dashboard/          # React web app — Owner & Promoter dashboard
```

---

## Getting Started

### Prototype (React)
Open `prototype/NightListPrototype.jsx` in any React sandbox (Claude.ai, CodeSandbox, StackBlitz) or drop into a Vite project.

### iOS App (SwiftUI)
```bash
cd ios
open NightList.xcodeproj
```
Requires Xcode 15+ and iOS 17+ SDK.

### Owner Dashboard (React + Vite)
```bash
cd dashboard
npm install
npm run dev
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| iOS App | SwiftUI, Swift 5.9 |
| Owner Dashboard | React 18, Vite, TailwindCSS |
| Backend (planned) | Supabase (Auth, DB, Realtime) |
| Payments | Stripe iOS SDK + Stripe.js |
| Floor Plan | SwiftUI Canvas / Konva.js |
| Push Notifications | APNs |

---

## Roadmap

- [ ] iOS app — Discover & Venue screens
- [ ] iOS app — Blueprint / floor plan interaction
- [ ] iOS app — Booking flow + Stripe
- [ ] Owner dashboard — Floor plan builder
- [ ] Owner dashboard — Booking management
- [ ] Promoter portal
- [ ] Supabase backend integration
- [ ] App Store submission

---

## Contributing
Built by [@lloredia](https://github.com/lloredia)
