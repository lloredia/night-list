# 🌙 Night List

> **Get On The List.**

Night List is a two-sided nightlife booking platform.

| Who | Experience |
|-----|------------|
| **Owners** | **Web app** — manage venues, bookings, floor plans, and promoters in the browser. |
| **Users (guests)** | **Phone app** — discover venues, view floor plans, and reserve tables on iOS. |

---

## Repo Structure

```
night-list/
├── dashboard/          # Web app — Owner & Promoter dashboard (React + Vite)
├── ios/                # Phone app — Guest experience (SwiftUI, NightList.app)
└── prototype/          # Early React UI prototype (browser)
```

---

## Getting Started

### Owners — Web app (dashboard)
```bash
cd dashboard
npm install
npm run dev
```
Open the URL (e.g. http://localhost:5173) to manage venues, bookings, and promoters.

### Users — Phone app (iOS)
```bash
cd ios
open NightList.xcodeproj
```
Build and run in Xcode (iOS 17+). Guests use this app to discover venues and reserve tables.

### Prototype
Open `prototype/NightListPrototype.jsx` in a React sandbox (CodeSandbox, StackBlitz) for early UI reference.

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
