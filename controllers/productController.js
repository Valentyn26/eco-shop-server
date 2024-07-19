const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Product, ProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

class ProductController {
    async create(req, res, next) {
        const { name, price, typeId, info } = req.body;
        const file = req.file;
        let fileName = uuid.v4();

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        try {
            await s3Client.send(new PutObjectCommand(params));
        } catch (err) {
            console.error("Error uploading file: ", err);
            res.status(500).send("Error uploading file.");
        }

        const product = await Product.create({ name, price, typeId, img: fileName, info });

        return res.json(product);
    }

    async getAll(req, res) {
        let { typeId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = page * limit - limit;
        let products = {
            rows: [],
            count: 0
        };
        if (!typeId && offset >= 0) {
            products = await Product.findAndCountAll({ limit, offset });
        }

        if (typeId && offset >= 0) {
            products = await Product.findAndCountAll({ where: { typeId }, limit, offset });
        }

        for (let product of products.rows) {
            const getObjectParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: product.img
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 180 });
            product.img = url;
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

        const getObjectParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: product.img
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 180 });
        product.img = url;

        return res.json(product);
    }

    async deleteOne(req, res) {
        const { id } = req.query;

        const product = await Product.findOne(
            {
                where: { id }
            }
        );

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: product.img
        }

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);

        const result = await Product.destroy(
            {
                where: { id }
            }
        );

        return res.json(result);
    }
}

module.exports = new ProductController();