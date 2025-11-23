import {db} from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import {users} from './models.js'


const notification = db.define("notification", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    title: {type: DataTypes.STRING, allowNull: false},
    message: {type: DataTypes.TEXT, allowNull: false},
    type: {
        type: DataTypes.ENUM(
            "proposal",
            "proposal_accepted",
            "delivery",
            "payment",
            "review",
            "system"
        ),
        defaultValue: "system"
    },
    is_read: {type: DataTypes.BOOLEAN, defaultValue:false}

}, {timestamps:true});


export default notification;