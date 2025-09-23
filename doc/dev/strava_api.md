# Strava API Calls Overview

## Relevant Files

- **Wrapper Component**: `src/components/routes/RoutesApps.vue`
- **Strava Component**: `src/components/routes/StravaApp.vue`
- **Store**: `src/stores/strava.ts`

## API Calls

### Automatic fetch for Front End on page load

- **API Call**: `GET /strava_account` (via `stravaStore.loadAccount()`)
- **Purpose**: Load existing Strava account data if any
- **Triggered**: When StravaApp component mounts and no account exists in store

### Connect New Account Flow

- **Step 1**: `GET /strava-connect/<(read|read_all)>/` (via `stravaStore.loadAuthUrl()`)
  - Purpose: Get Strava OAuth authorization URL
  - User clicks "Link to App" button
- **Step 2**: Browser redirects to Strava for OAuth
- **Step 3**: Browser redirects to `/routes/connect-third-party-apps` URL with `?code=xxx` param
  - `RoutesApps.vue` reads code param onMounted
- **Step 4**: `GET /strava-auth/<auth_code>/` (via `stravaStore.authAccount()`)
  - Purpose: Get User Strava account token (access, refresh), create User Strava account in our DB, synchronize User Strava account data if it exists.
  - REST API URL endpoint return JSON with structure:
    ```
    response = {
        "account_status": "created" if created else "updated",
        "account": strava_account,
    }
    ```
  - Triggered when user returns from Strava with code parameter

### Sync Account Data

- **API Call**: `GET /strava_account/sync/` (via `stravaStore.syncAccount()`)
- **Purpose**: Sync activities from Strava to local trips
- **Triggered**: User clicks "Synchronize" button

### Disconnect Account

- **API Call**: `GET /strava-disconnect/` (via `stravaStore.disconnectAccount()`)
- **Purpose**: Disconnect Strava account
- **Triggered**: User clicks "Remove account" button
