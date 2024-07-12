type RoutesConf = {
  [key: string]: {
    path: string;
    children: {
      fullPath?: string;
      name: string;
    };
  };
};

const routesConf: RoutesConf = {
  community: {
    path: '/community',
    children: {
      fullPath: '/community',
      name: 'community',
    },
  },
  company_coordinator: {
    path: '/company-coordinator',
    children: {
      fullPath: '/company-coordinator',
      name: 'company-coordinator',
    },
  },
  home: {
    path: '/',
    children: {
      fullPath: '/',
      name: 'home',
    },
  },
  login: {
    path: '/login',
    children: {
      fullPath: '/login',
      name: 'login',
    },
  },
  prizes: {
    path: '/prizes',
    children: {
      fullPath: '/prizes',
      name: 'prizes',
    },
  },
  register: {
    path: '/register',
    children: {
      fullPath: '/register',
      name: 'register',
    },
  },
  register_coordinator: {
    path: '/register-coordinator',
    children: {
      fullPath: '/register-coordinator',
      name: 'register-coordinator',
    },
  },
  register_challenge: {
    path: '/register-challenge',
    children: {
      fullPath: '/register-challenge',
      name: 'register-challenge',
    },
  },
  results: {
    path: '/results',
    children: {
      fullPath: '/results',
      name: 'results',
    },
  },
  results_detail: {
    path: 'detail',
    children: {
      fullPath: '/results/detail',
      name: 'results_detail',
    },
  },
  results_report: {
    path: 'report',
    children: {
      fullPath: '/results/detail/report',
      name: 'results_detail_report',
    },
  },
  results_regularity: {
    path: 'regularity',
    children: {
      fullPath: '/results/detail/regularity',
      name: 'results_detail_regularity',
    },
  },
  results_performance: {
    path: 'performance',
    children: {
      fullPath: '/results/detail/performance',
      name: 'results_detail_performance',
    },
  },
  routes: {
    path: '/routes',
    children: {
      fullPath: '/routes',
      name: 'routes',
    },
  },
  routes_calendar: {
    path: 'calendar',
    children: {
      fullPath: '/routes/calendar',
      name: 'routes_calendar',
    },
  },
  routes_list: {
    path: 'list',
    children: {
      fullPath: '/routes/list',
      name: 'routes_list',
    },
  },
  routes_map: {
    path: 'map',
    children: {
      fullPath: '/routes/map',
      name: 'routes_map',
    },
  },
  routes_app: {
    path: 'app',
    children: {
      fullPath: '/routes/app',
      name: 'routes_app',
    },
  },
};

export { routesConf };
