import db from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { use } from 'react';

const users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        index: true,
        tolowercase: true,
        trim: true
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        trim: true,
        require: true,
        index: true
         
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        require: true,
        validator: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        require: [true, 'Password is required'],
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
    },
    
    refrashToken: {
        type: DataTypes.TEXT,
        allowNull: true
    }

    }, {timestamps:true})

    // adding hooks to hash password before saving
    users.addHook('beforeSave', async function (next) {
        if (!this.isModified('password')) return next();

        this.password = await bcrypt.hash(this.password, 10);  // hashing password with salt rounds of 10
        next();
    });

    // method to compare password
    users.methods.comparePassword = async function (password) {
        await bcrypt.compare(password, this.password); // comparing hashed password
    }

    // method to generate JWT token
    users.methods.genrateToken = function () {
        return jwt.sign(
            {
                id: this.id,
                username: this.username,
                role: this.role,
                email: this.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN

            }
        )
    }
    
    // method to generate refresh token
    users.methodes.genrateRefreshToken = function () {
         return jwt.sign(
            {
                id: this.id,
            },
            process.env.JWT_REFRESH_SERCRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        )
    }


export default users;