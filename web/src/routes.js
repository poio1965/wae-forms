// node imports
const router = require('express').Router();

// app imports
const attractionTemplateService = require('./services/attractionTemplateService');
const museumTemplateService = require('./services/museumTemplateService');
const restaurantTemplateService = require('./services/restaurantTemplateService');
const shopTemplateService = require('./services/shopTemplateService');
const touristGuideService = require('./services/touristGuideService');
const mediaService = require('./services/mediaService');
const fileService = require('./services/external/fileService');

const requestInterceptor = require('./utils/requestInterceptor');

router.use(function (req, res, next) {
	requestInterceptor.setRequestInfo(req);
	next();
});

router.get('/attraction-template', attractionTemplateService.getAll);
router.post('/attraction-template', attractionTemplateService.create);
router.get('/attraction-template/:id', attractionTemplateService.find);
router.delete('/attraction-template/:id', attractionTemplateService.remove);
router.put('/attraction-template/:id', attractionTemplateService.update);

router.get('/museum-template', museumTemplateService.getAll);
router.post('/museum-template', museumTemplateService.create);
router.get('/museum-template/:id', museumTemplateService.find);
router.delete('/museum-template/:id', museumTemplateService.remove);
router.put('/museum-template/:id', museumTemplateService.update);

router.get('/restaurant-template', restaurantTemplateService.getAll);
router.post('/restaurant-template', restaurantTemplateService.create);
router.get('/restaurant-template/:id', restaurantTemplateService.find);
router.delete('/restaurant-template/:id', restaurantTemplateService.remove);
router.put('/restaurant-template/:id', restaurantTemplateService.update);

router.get('/shop-template', shopTemplateService.getAll);
router.post('/shop-template', shopTemplateService.create);
router.get('/shop-template/:id', shopTemplateService.find);
router.delete('/shop-template/:id', shopTemplateService.remove);
router.put('/shop-template/:id', shopTemplateService.update);

router.get('/tourist-guide-template', touristGuideService.getAll);
router.post('/tourist-guide-template', touristGuideService.create);
router.get('/tourist-guide-template/:id', touristGuideService.find);
router.delete('/tourist-guide-template/:id', touristGuideService.remove);
router.put('/tourist-guide-template/:id', touristGuideService.update);

router.get('/media/:id/download', mediaService.streamMediaFile);
router.get('/media/:id', mediaService.find);
router.get('/media', mediaService.getAll);
router.post('/upload', fileService.upload.single('file'), mediaService.createMediaFile);
router.post('/upload-resource', fileService.upload.single('file'), mediaService.createUnattachedMediaFile);
router.delete('/media/:id', mediaService.remove);
router.post('/upload/:id', fileService.upload.single('file'), mediaService.saveFile);



module.exports = router;