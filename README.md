# CyberHabits

**Upgrade your routine.**

CyberHabits is an open-source habit and productivity RPG with a cyber-noir
identity. It is an independent fork of
[Habitica](https://github.com/HabitRPG/habitica), retaining its task engine
while progressively replacing the fantasy presentation, branding, writing,
and artwork.

## Project status

The project is in its first rebranding phase on the `cyberpunk-mvp` branch.
The initial milestone covers:

- independent CyberHabits branding and metadata;
- a reusable neon cyber-noir design palette;
- the core task dashboard and onboarding experience;
- an asset and trademark separation audit.

Working vocabulary: Gold becomes **Credits**, Experience becomes
**Reputation (REP)**, Mana becomes **Charge**, Quests become **Contracts**, and
Parties become **Crews**. These are presentation labels; inherited internal API
field names remain unchanged for compatibility.

Inherited fantasy assets remain during development and must not be treated as
final CyberHabits artwork.

## Development

CyberHabits currently follows the upstream development requirements:

- Node.js 20
- npm 10
- MongoDB for server and integration testing

Install dependencies and run the client:

```sh
npm install
npm run client:dev
```

Run checks:

```sh
npm run lint-no-fix
npm run test:common
npm run client:unit
npm run client:build
```

## Licensing and attribution

CyberHabits is derived from Habitica. Code remains available under GNU GPL
version 3. Inherited content and assets have separate terms, including
CC BY-SA 3.0 and CC BY-NC-SA 3.0; see [LICENSE](LICENSE) for the upstream
license notice.

New CyberHabits-specific artwork and content will be identified separately as
it is introduced. Habitica is not affiliated with or responsible for this
fork.

## Upstream

- Source: https://github.com/HabitRPG/habitica
- CyberHabits fork: https://github.com/WhoIsSeanGalt/CyberHabits