import galleryManagementRoutes from '@/modules/managers/galleryManagement/GalleryManagement.routes.js'
import usersManagementRoutes from '@/modules/managers/usersManagement/UsersManagement.routes.js';

const baseRoutes = [];

const routes = baseRoutes
.concat(galleryManagementRoutes)
.concat(usersManagementRoutes);

export default routes;