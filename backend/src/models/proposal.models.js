import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const propsals = db.define('proposals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        referances: {
            model: 'projects',
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        referances: {
            model: 'users',
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    cover_letter: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    bid_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validators: {
            greaterThan: 0
        } 
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {timestamps: true, createdAT: 'created_at'});