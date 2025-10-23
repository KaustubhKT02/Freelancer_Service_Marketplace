import db from '../config/db.config.js';
import { DataTypes } from 'sequelize';

const users = db.define('users', {
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
        unique: true,
        validator: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validators: {
            is: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ 
        }
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


export default users;