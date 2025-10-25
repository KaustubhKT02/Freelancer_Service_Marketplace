import {db} from '../config/db.config.js'
import { DataTypes} from "sequelize";

const projects = db.define('projects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(150),
        require: true,
        allowNull: false
    }, 
    description: {
        type: DataTypes.TEXT,
        require: true,
        allowNull: false

    },
    budget: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validators: {
            graterThan: 0
        }
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    }, 
    status: {
        type: DataTypes.ENUM('open', 'in progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'open'
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        refrances: {
            Model: 'users',
            key: 'id',
            onDelete: 'CASCADE',
        }
    },
 

}, { timestamps: true, createdAt: 'created_at' });

export default projects;