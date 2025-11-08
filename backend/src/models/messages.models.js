import {db} from '../config/db.config.js'
import { DataTypes } from 'sequelize';

const messages = db.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        referances: {
            model: 'users',
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    reciver_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        referances: {
            model: 'users',
            key: 'id',
            onDelete: 'cascade'
        }
    },
    content: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },

    attachment_url : {
        type: DataTypes.STRING,
        allowNull: true
    },

    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, {timestamps: true});

export default messages;