let routes = [
  {
    path: '/metadata',
    name: 'metadata',
    component: () => import('@/modules/managers/metadata/Metadata.vue'),
    children: [
      {
        path: 'new-metadata',
        name: 'new-metadata',
        component: () => import('@/modules/managers/metadata/MetadataForm.vue')
      },
      {
        path: ':id',
        name: 'edit-metadata',
        component: () => import('@/modules/managers/metadata/MetadataForm.vue'),
        props: true
      }
    ]
  }
];

export default routes;
