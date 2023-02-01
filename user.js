const { sequelize, DataTypes } = require('./db');

const user = sequelize.define('user', {
    tID: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.NUMBER
    },
}, {
    indexes: [{ unique: true, fields: ['tID'] }]
});

sequelize.sync({ alter: true });

module.exports = {
    user
}