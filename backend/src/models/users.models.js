import {db} from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken';


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
        set(value) {
            this.setDataValue('username', value.trim().toLowerCase())
        } 
    },

    fullname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value) {
            this.setDataValue('fullname', value.trim())
        }         
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('email', value.trim().toLowerCase())  
        },

        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
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
        validate: {
            min: 0,
            max: 5
        }
    }, 
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
    }

    }, {timestamps:true,
        defaultScope: {
            attributes: {exclude: ['password', 'refreshToken']}
        },
        
        scopes: {
            withSensitive: {
                attributes: {include: ['password', 'refreshToken']}
            }
        }
    })

    // adding hooks to hash password before saving
    users.beforeCreate(async (user)=> {
        if(user.password) {
           user.password =  await bcrypt.hash(user.password, 10)
        }
    });

    users.beforeUpdate(async (user)=> {
        if(user.changed('password')) {
           user.password = await bcrypt.hash(user.password, 10)
        }
    })

    // method to compare password
    users.prototype.comparePassword = async function(password) {
       return bcrypt.compare(password, this.password);  // compare password using promise
    };

    // method to generate JWT token
    users.prototype.generateToken = function () {
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
    users.prototype.generateRefreshToken = function () {
         return jwt.sign(
            {
                id: this.id,
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        )
    }


export default users;