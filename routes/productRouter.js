const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require('../middleware/checkRoleMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', checkRole('ADMIN'), upload.single('img'), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.delete('/', checkRole('ADMIN'), productController.deleteOne);

module.exports = router;