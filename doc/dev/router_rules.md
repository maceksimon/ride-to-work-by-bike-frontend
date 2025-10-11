# Router rules

## List of variables relevant for routing user (allowed-disallowed pages)

- user is logged in
- user email is verified
- app is accessible (phase = registration, entry_enabled, or results)
- user is registered into challenge
- user is admin (company coordinator)
- registration phase is active

## List of access types (sets of allowed-disallowed pages)

- login (login, register, confirm email, password)
- verify email (only)
- challenge inactive (only)
- register challenge (register-challenge, register-coordinator)
- full app (home, routes, prizes, results, profile)

| Logged in | Email Verified | App Accessible | Registration Complete | User Admin | Registration Active | Org has Admin |       Access       |
| :-------: | :------------: | :------------: | :-------------------: | :--------: | :-----------------: | :-----------: | :----------------: |
|     ✗     |       -        |       -        |           -           |     -      |          -          |       -       |       login        |
|     ✓     |       ✗        |       -        |           -           |     -      |          -          |       -       |    verify email    |
|     ✓     |       ✓        |       ✗        |           -           |     -      |          -          |       -       | challenge inactive |
|     ✓     |       ✓        |       ✓        |           ✓           |     ✓      |          -          |       -       |      FA + CO       |
|     ✓     |       ✓        |       ✓        |           ✓           |     ✗      |          -          |       ✗       |      FA + BCO      |
|     ✓     |       ✓        |       ✓        |           ✓           |     ✗      |          -          |       ✓       |         FA         |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✗      |          ✓          |       -       |        RCH         |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✗      |          ✗          |       -       | challenge inactive |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✓      |          ✓          |       -       |   FA + CO + RCH    |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✓      |          ✗          |       -       |      FA + CO       |

- FA - full app access
- RCH - register challenge
- CO - coordinator
- BCO - become coordinator (if organization has no admin)

- Note: Full app access + register-challenge allows `/register-challenge` route but not `/register-coordinator` route.
