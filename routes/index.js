const Router = require('express');
const router = new Router();
const typeRouter = require('./typeRouter');
const productRouter = require('./productRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);
router.use('/basket', basketRouter);

module.exports = router;