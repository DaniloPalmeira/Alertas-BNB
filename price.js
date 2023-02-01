const { sequelize, DataTypes, Sequelize } = require('./db');

const price = sequelize.define('price', {
    aid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    time: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    indexes: [{ unique: true, fields: ['tID'] }]
});

sequelize.sync({ alter: true });

module.exports = {
    price
}