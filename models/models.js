const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: DataTypes.INTEGER, allowNull: false },
});

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.REAL, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    info: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Product.hasOne(BasketProduct);
BasketProduct.belongsTo(Product);

Type.hasMany(Product);
Product.belongsTo(Type);

module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type
}