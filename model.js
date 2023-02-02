import Sequelize from 'sequelize'
const sequelize = new Sequelize('dzencode', 'root', '7777777',
    {
        dialect: 'mysql',
        host: '127.0.0.1',
        define: {
            collate: 'utf8mb4_general_ci',
            timestamps: false
        }
    }
)

const Message = sequelize.define("message", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    parent: {
        type: Sequelize.STRING,
        allowNull: false
    },
    level: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    msg: {
        type: Sequelize.TEXT('medium'),
        allowNull: false
    },
    txt: {
        type: Sequelize.TEXT('medium'),
        allowNull: false
    },
    ext: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ts: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

sequelize.sync().then(result => {

}).catch(err=> console.log(err))

export default Message
