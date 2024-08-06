// import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Create data',
    path: '/',
    active: true,
  },
    
  {
    id: 'pricing',
    subheader: 'Data Collection',
    path: '/table',
  },
  {
    id: 'users',
    subheader: 'Create Table',
    path: '/create-table',
  },
  // {
  //   id: 'features',
  //   subheader: 'Visualize',
  //   path: '/visualize:id',
  // },

  // {
  //   id: 'integrations',
  //   subheader: 'Integrations',
  //   path: '#!',
  // },
  // {
  //   id: 'authentication',
  //   subheader: 'Authentication',
  //   icon: 'mingcute:safe-lock-fill',
  //   items: [
  //     {
  //       name: 'Login',
  //       pathName: 'login',
  //       path: paths.login,
  //     },
  //     {
  //       name: 'Signup',
  //       pathName: 'signup',
  //       path: paths.signup,
  //     },
  //   ],
  // },
  // {
  //   id: 'settings',
  //   subheader: 'Settings',
  //   path: '#!',
  //   icon: 'material-symbols:settings-rounded',
  //   active: true,
  // },
  // {
  //   id: 'template-pages',
  //   subheader: 'Template pages',
  //   path: '#!',
  //   icon: 'mingcute:document-2-fill',
  // },
  // {
  //   id: 'account-settings',
  //   subheader: 'John Carter',
  //   path: '#!',
  // },
];

export default sitemap;
