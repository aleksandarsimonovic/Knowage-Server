let routes = [
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/modules/managers/rolesManagement/RolesManagement.vue'),
  }
];

export default routes;
