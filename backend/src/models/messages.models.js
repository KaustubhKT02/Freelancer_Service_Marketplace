import db from '../config/database.js';
import {DataType} from 'sequelize';

const messages = db.define('messages', {
    id: {
        type: DataType.INTEGER,
        primarykey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataType.INTEGER,
        allowNull: false,
        referances: {
            model: 'users',
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    reciver_id: {
        type:DataType.INTEGER,
        allowNull: false,
        referances: {
            model: 'users',
            key: 'id',
            onDelete: 'cascade'
        }
    },
    content: {
        type: DataType.TEXT, 
        allowNull: false,
    },
    is_read: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, {timestamps: true});

export default messages;