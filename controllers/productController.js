const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next) {
        try {
            const { name, price, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve('/app', 'static', fileName));

            const product = await Product.create({ name, price, typeId, img: fileName, info });

            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

    async getAll(req, res) {
        let { typeId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = page * limit - limit;
        let products;
        if (!typeId) {
            products = await Product.findAndCountAll({ limit, offset });
        }

        if (typeId) {
            products = await Product.findAndCountAll({ where: { typeId }, limit, offset });
        }

        return res.json(products);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const product = await Product.findOne(
            {
                where: { id }
            }
        );
        return res.json(product);
    }

    async deleteOne(req, res) {
        const { id } = req.query;
        const product = await Product.destroy(
            {
                where: { id }
            }
        );
        return res.json(product);
    }
}

module.exports = new ProductController();