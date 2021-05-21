import galleryManagementRoutes from '@/modules/managers/galleryManagement/GalleryManagement.routes.js'
import metadataRoutes from '@/modules/managers/metadata/Metadata.routes.js';

const baseRoutes = [];

const routes = baseRoutes.concat(galleryManagementRoutes).concat(metadataRoutes);

export default routes;