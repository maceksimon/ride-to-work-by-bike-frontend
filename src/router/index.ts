import { inject } from 'vue';
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router';
import { useChallengeStore } from 'src/stores/challenge';
import { useLoginStore } from 'src/stores/login';
import { useRegisterStore } from 'src/stores/register';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import routes from './routes';
import { routesConf } from './routes_conf';
import { PhaseType } from '../components/types/Challenge';

import type { Logger } from '../components/types/Logger';

// defines important states for routing
interface RouterState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isAppAccessible: boolean;
  isRegistrationComplete: boolean;
  isUserOrganizationAdmin: boolean;
  isRegistrationPhaseActive: boolean;
}

// defines commonly used route groups
const ROUTE_GROUPS = {
  LOGIN: ['login', 'register', 'confirm_email', 'reset_password'],
  VERIFY_EMAIL: ['verify_email', 'confirm_email'],
  CHALLENGE_INACTIVE: ['challenge_inactive'],
  REGISTER_CHALLENGE: ['register_challenge', 'register_coordinator'],
  FULL_APP_RESTRICTED: [
    'login',
    'register',
    'verify_email',
    'reset_password',
    'challenge_inactive',
    'register_challenge',
    'register_coordinator',
  ],
  ADMIN_FULL_APP_RESTRICTED: [
    'login',
    'register',
    'verify_email',
    'reset_password',
    'challenge_inactive',
    'routes',
    'register_coordinator',
  ],
} as const;

/**
 * Logs the current router state.
 * @param {Logger | null} logger - logger instance
 * @param {RouteLocationNormalized} to - to route location
 * @param {RouteLocationNormalized} from - from route location
 * @param {RouterState} state - router state loaded from stores
 */
function logRouterState(
  logger: Logger | null,
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  state: RouterState,
): void {
  logger?.debug(`Router path <${to.path}>.`);
  logger?.debug(`Router from path <${from.path}>.`);
  logger?.debug(`Router user is authenticated <${state.isAuthenticated}>.`);
  logger?.debug(`Router user email is verified <${state.isEmailVerified}>.`);
  logger?.debug(
    `Router registration phase is active <${state.isRegistrationPhaseActive}>.`,
  );
  logger?.debug(
    `Router registration app is accessible <${state.isAppAccessible}>`,
  );
  logger?.debug(
    `Router registration is complete <${state.isRegistrationComplete}>.`,
  );
  logger?.debug(
    `Router user is organization admin <${state.isUserOrganizationAdmin}>.`,
  );
}

/**
 * Checks if the current `to` route is accessing any of the given routes.
 * @param {RouteLocationNormalized} to - to route location
 * @param {readonly string[]} routeNames - route names to check against
 * @param {Record<string, { path: string }>} routesConf - routes configuration
 * @returns {boolean} - whether the route is matched
 */
function isAccessingRoutes(
  to: RouteLocationNormalized,
  routeNames: readonly string[],
  routesConf: Record<string, { path: string }>,
): boolean {
  return to.matched.some((record) =>
    routeNames.some(
      (routeName) => record.path === routesConf[routeName]['path'],
    ),
  );
}

/**
 * Logs if the current `to` route is accessing any of the given routes.
 * @param {Logger | null} logger - logger instance
 * @param {readonly string[]} routeNames - route names to check against
 * @param {Record<string, { path: string }>} routesConf - routes configuration
 * @param {boolean} matched - whether the route is matched
 */
function logRouteCheck(
  logger: Logger | null,
  routeNames: readonly string[],
  routesConf: Record<string, { path: string }>,
  matched: boolean,
): void {
  const routePaths = routeNames
    .map((name) => routesConf[name]['path'])
    .join(', ');
  logger?.debug(
    `Router path <${routePaths}> is ${matched ? '' : 'not '}matched <${matched}>.`,
  );
}

/**
 * Redirects to the given path.
 * @param {Logger | null} logger - logger instance
 * @param {string} path - path to redirect to
 * @param {NavigationGuardNext} next - next function
 */
function redirect(
  logger: Logger | null,
  path: string,
  next: NavigationGuardNext,
): void {
  logger?.debug(`Router path redirect to page URL <${path}>.`);
  next({ path });
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const logger = inject('vuejs3-logger') as Logger | null;
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // turn off auth check if in Cypress tests (except for register tests)
  if (
    !window.Cypress ||
    window.Cypress.spec.name === 'register.spec.cy.js' ||
    window.Cypress.spec.name === 'router_rules.cy.js'
  ) {
    Router.beforeEach(async (to, from, next) => {
      const logger = inject('vuejs3-logger') as Logger | null;
      const challengeStore = useChallengeStore();
      const loginStore = useLoginStore();
      const registerStore = useRegisterStore();
      const registerChallengeStore = useRegisterChallengeStore();

      const state: RouterState = {
        isAuthenticated: await loginStore.validateAccessToken(),
        isEmailVerified: registerStore.getIsEmailVerified,
        isRegistrationPhaseActive: challengeStore.getIsChallengeInPhase(
          PhaseType.registration,
        ),
        isAppAccessible:
          challengeStore.getIsChallengeInPhase(PhaseType.registration) ||
          challengeStore.getIsChallengeInPhase(PhaseType.entryEnabled) ||
          challengeStore.getIsChallengeInPhase(PhaseType.results),
        isRegistrationComplete:
          registerChallengeStore.getIsRegistrationComplete,
        isUserOrganizationAdmin:
          registerChallengeStore.getIsUserOrganizationAdmin || false,
      };

      logRouterState(logger, to, from, state);
      // Login access: ONLY access LOGIN path group
      if (
        !state.isAuthenticated &&
        !isAccessingRoutes(to, ROUTE_GROUPS.LOGIN, routesConf)
      ) {
        logRouteCheck(logger, ROUTE_GROUPS.LOGIN, routesConf, false);
        redirect(logger, routesConf['login']['path'], next);
        return;
      }
      // Verify email access: ONLY access VERIFY_EMAIL path group
      if (
        state.isAuthenticated &&
        !state.isEmailVerified &&
        !isAccessingRoutes(to, ROUTE_GROUPS.VERIFY_EMAIL, routesConf)
      ) {
        logRouteCheck(logger, ROUTE_GROUPS.VERIFY_EMAIL, routesConf, false);
        redirect(logger, routesConf['verify_email']['path'], next);
        return;
      }
      // Challenge inactive access: ONLY access CHALLENGE_INACTIVE path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        !state.isAppAccessible &&
        !isAccessingRoutes(to, ROUTE_GROUPS.CHALLENGE_INACTIVE, routesConf)
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.CHALLENGE_INACTIVE,
          routesConf,
          false,
        );
        redirect(logger, routesConf['challenge_inactive']['path'], next);
        return;
      }
      // Full app access: NO access FULL_APP_RESTRICTED path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        state.isAppAccessible &&
        state.isRegistrationComplete &&
        isAccessingRoutes(to, ROUTE_GROUPS.FULL_APP_RESTRICTED, routesConf)
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.FULL_APP_RESTRICTED,
          routesConf,
          true,
        );
        redirect(logger, routesConf['home']['path'], next);
        return;
      }
      // Register challenge access: ONLY access REGISTER_CHALLENGE path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        state.isAppAccessible &&
        !state.isRegistrationComplete &&
        !state.isUserOrganizationAdmin &&
        state.isRegistrationPhaseActive &&
        !isAccessingRoutes(to, ROUTE_GROUPS.REGISTER_CHALLENGE, routesConf)
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.REGISTER_CHALLENGE,
          routesConf,
          false,
        );
        redirect(logger, routesConf['register_challenge']['path'], next);
        return;
      }
      // Challenge inactive access: ONLY access CHALLENGE_INACTIVE path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        state.isAppAccessible &&
        !state.isRegistrationComplete &&
        !state.isUserOrganizationAdmin &&
        !state.isRegistrationPhaseActive &&
        !isAccessingRoutes(to, ROUTE_GROUPS.CHALLENGE_INACTIVE, routesConf)
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.CHALLENGE_INACTIVE,
          routesConf,
          false,
        );
        redirect(logger, routesConf['challenge_inactive']['path'], next);
        return;
      }
      // Full app + Register challenge access: NO access ADMIN_FULL_APP_RESTRICTED path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        state.isAppAccessible &&
        !state.isRegistrationComplete &&
        state.isUserOrganizationAdmin &&
        state.isRegistrationPhaseActive &&
        isAccessingRoutes(
          to,
          ROUTE_GROUPS.ADMIN_FULL_APP_RESTRICTED,
          routesConf,
        )
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.ADMIN_FULL_APP_RESTRICTED,
          routesConf,
          true,
        );
        redirect(logger, routesConf['home']['path'], next);
        return;
      }
      // Full app access: NO access FULL_APP_RESTRICTED path group
      if (
        state.isAuthenticated &&
        state.isEmailVerified &&
        state.isAppAccessible &&
        !state.isRegistrationComplete &&
        state.isUserOrganizationAdmin &&
        !state.isRegistrationPhaseActive &&
        isAccessingRoutes(to, ROUTE_GROUPS.FULL_APP_RESTRICTED, routesConf)
      ) {
        logRouteCheck(
          logger,
          ROUTE_GROUPS.FULL_APP_RESTRICTED,
          routesConf,
          true,
        );
        redirect(logger, routesConf['home']['path'], next);
        return;
      }

      // Allow navigation if no conditions matched
      logger?.info('Router call <next()> function.');
      next();
    });
  } else {
    logger?.info('Authentification was disabled for Cypress e2e tests.');
  }

  return Router;
});
