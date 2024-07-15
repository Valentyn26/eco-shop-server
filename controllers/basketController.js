const { Basket, BasketProduct } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async addProduct(req, res) {
        const { basketId, productId, count } = req.body;

        const alreadyIs = await BasketProduct.findOne({ where: { basketId, productId } });

        if (!alreadyIs) {
            const basketProduct = await BasketProduct.create({ basketId, productId, count });
            return res.json(basketProduct);
        } else {
            alreadyIs.count = count;
            await alreadyIs.save();
            return res.json(alreadyIs);
        }
    }

    async getAll(req, res) {
        let { basketId } = req.query;

        const basketProduct = await BasketProduct.findAll({ where: { basketId } });

        return res.json(basketProduct);
    }

    async deleteOne(req, res) {
        let { basketId, productId, id } = req.query;

        if (id) {
            const basketProduct = await BasketProduct.destroy({ where: { id } });
            return res.json(basketProduct);
        }

        const basketProduct = await BasketProduct.destroy({ where: { basketId, productId } });
        return res.json(basketProduct);
    }
}

module.exports = new BasketController();