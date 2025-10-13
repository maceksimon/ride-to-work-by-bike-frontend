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

| Logged in | Email Verified | App Accessible | Registration Complete | Org. coordinator user | Registration Active | Org. has coordinator |       Access       |
| :-------: | :------------: | :------------: | :-------------------: | :-------------------: | :-----------------: | :------------------: | :----------------: |
|     ✗     |       -        |       -        |           -           |           -           |          -          |          -           |       login        |
|     ✓     |       ✗        |       -        |           -           |           -           |          -          |          -           |    verify email    |
|     ✓     |       ✓        |       ✗        |           -           |           -           |          -          |          -           | challenge inactive |
|     ✓     |       ✓        |       ✓        |           ✓           |           ✓           |          -          |          -           |      FAR + CO      |
|     ✓     |       ✓        |       ✓        |           ✓           |           ✗           |          -          |          ✗           |      FAR + BC      |
|     ✓     |       ✓        |       ✓        |           ✓           |           ✗           |          -          |          ✓           |        FAR         |
|     ✓     |       ✓        |       ✓        |           ✗           |           ✗           |          ✓          |          ✗           |     RCH + RCO      |
|     ✓     |       ✓        |       ✓        |           ✗           |           ✗           |          ✓          |          ✓           |        RCH         |
|     ✓     |       ✓        |       ✓        |           ✗           |           ✗           |          ✗          |          -           | challenge inactive |
|     ✓     |       ✓        |       ✓        |           ✗           |           ✓           |          ✓          |          -           |   FA + CO + RCH    |
|     ✓     |       ✓        |       ✓        |           ✗           |           ✓           |          ✗          |          -           |      FA + CO       |

- FAR - full app access with routes
- FA - full app access without routes (organization coordinator who does not participate)
- RCH - register challenge
- RCO - register organization coordinator
- CO - organization coordinator
- BC - become organization coordinator
