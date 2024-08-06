
export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pagesRoot}/dashboard`,
  visualize: `/${rootPaths.pagesRoot}/visualize`,
  visualizeTable: `/${rootPaths.pagesRoot}/visualize-table`,
  dataTable: `/${rootPaths.pagesRoot}/dataTable`,
  features: `/${rootPaths.pagesRoot}/features`,
  createTable: `/${rootPaths.pagesRoot}/createTable`,
  manualTable: `/${rootPaths.pagesRoot}/manualTable`,
  users: `/${rootPaths.pagesRoot}/users`,
  pricing: `/${rootPaths.pagesRoot}/pricing`,
  integrations: `/${rootPaths.pagesRoot}/integrations`,
  settings: `/${rootPaths.pagesRoot}/settings`,
  templatePages: `/${rootPaths.pagesRoot}/template-pages`,
  accountSettings: `/${rootPaths.pagesRoot}/account-settings`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,
};
