# CyberHabits

**Upgrade your routine.**

CyberHabits is a static, alternative web client for
[Habitica](https://habitica.com). Habitica remains the source of truth for user
accounts, tasks, progress, social groups, and subscriptions; CyberHabits
provides an independent cyber-noir interface.

CyberHabits is not affiliated with or endorsed by Habitica.

## Architecture

CyberHabits has no application server, user database, payment processor, or
subscription ledger. The browser communicates directly with Habitica's public
API over HTTPS.

Users connect with the User ID and API Token available from Habitica's API
settings. Those credentials are stored only in that browser's local storage and
are attached directly to requests sent to `https://habitica.com`. Logging out
removes local credentials.

Every API request uses the CyberHabits `X-Client` identifier. Deployments and
contributors must follow Habitica's API Usage Guidelines, including rate limits
and delays for background automation. CyberHabits does not perform background
automation in its baseline client.

Account registration, password recovery, account deletion, purchases, and
subscription management stay on Habitica's official website and apps.

## Terminology

CyberHabits changes presentation labels without changing Habitica API field
names:

- Gold → **Credits**
- Experience / XP → **Reputation / REP**
- Mana / MP → **Charge / CHG**
- Quests → **Contracts**
- Parties → **Crews**
- Inventory → **Stash**
- Equipment / Gear → **Chrome**
- Pets → **Bots**
- Mounts → **Rides**
- Skills / Spells → **Hacks**
- Mage → **Runner**
- Rogue → **Assassin**
- Healer → **Engineer**
- Warrior → **Enforcer**
- Tavern chat → **The Sprawl**
- Pause Damage / sleep state → **Hibernate**

## Current status

The `cyberpunk-mvp` branch is migrating the inherited interface into a static
Habitica-backed client. Current work covers:

- direct Habitica API authentication and data access;
- independent CyberHabits branding and cyber-noir styling;
- core task dashboard and navigation terminology;
- removal of duplicate server, payment, and entitlement behavior from the
  runtime architecture;
- replacement of inherited fantasy artwork with original assets.

Some inherited fantasy content and unused server source remain in the Git
history and working tree during migration. They are not part of the intended
CyberHabits runtime and must not be treated as final CyberHabits assets.

## Development

Requirements:

- Node.js 20
- npm 10

Install and run the static client:

```sh
cd website/client
cp .env.example .env.local
# Set VITE_HABITICA_X_CLIENT to YOUR-HABITICA-USER-ID-CyberHabits
npm install
npm run serve
```

Build and check it:

```sh
cd website/client
npm run lint-no-fix
npm run test:unit
npm run build
```

No local MongoDB, Redis, payment credentials, email provider, or CyberHabits
backend is required for the client.

## Licensing and attribution

CyberHabits is derived from Habitica. Inherited code remains available under
GNU GPL version 3. Inherited content and assets have separate terms, including
CC BY-SA 3.0 and CC BY-NC-SA 3.0; see [LICENSE](LICENSE) for the upstream
license notice.

New CyberHabits-specific artwork and content will be identified separately as
it is introduced.

## Upstream

- Habitica source: https://github.com/HabitRPG/habitica
- CyberHabits: https://github.com/WhoIsSeanGalt/CyberHabits
