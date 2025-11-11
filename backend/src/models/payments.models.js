import {db} from '../config/db.config.js';
import { DataTypes } from 'sequelize';


 const payments = db.define('payments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
        allowNull: false,
    },
    razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    razorepay_payment_id: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate: {
      isPositive(value) {
        if (value <= 0) throw new Error("Budget must be greater than zero");
      }
    }
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
    },
    status: {
       type: DataTypes.ENUM('created', 'paid', 'captured', 'failed'),
       defaultValue: 'created', 
    },
    escrow_released: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },

    project_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'projects',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    client_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }

 }, {timestamps:true})


 export default payments;