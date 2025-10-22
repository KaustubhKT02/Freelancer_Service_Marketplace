import db from '../config/db.config.js';
import { DataTypes } from 'sequelize';

const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Client', 'Freelancer', 'Admin'),
        allowNull: false,
        defaultValue: 'Client'
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rating_avg: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
        validators: {
            min: 0,
            max: 5
        }
    }, 
    Profile: {
        type: DataTypes.STRING,
        allowNull: true
    }

    }, {timestamps:true})


export default Users;