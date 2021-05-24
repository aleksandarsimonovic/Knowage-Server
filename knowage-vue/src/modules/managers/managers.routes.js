import galleryManagementRoutes from '@/modules/managers/galleryManagement/GalleryManagement.routes.js'
import configurationManagementRoutes from '@/modules/managers/configurationManagement/ConfigurationManagement.routes.js';
import usersManagementRoutes from '@/modules/managers/usersManagement/UsersManagement.routes.js';
import domainsManagementRoutes from '@/modules/managers/domainsManagement/DomainsManagement.routes.js';

const baseRoutes = [];

const routes = baseRoutes
.concat(galleryManagementRoutes)
.concat(configurationManagementRoutes)
.concat(usersManagementRoutes)
.concat(domainsManagementRoutes);

export default routes;