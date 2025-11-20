import { db } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const payment_logs = db.define(
  "payment_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 1 },
    },

    payment_method: {
      type: DataTypes.ENUM("UPI", "Bank Transfer", "Cash", "Other"),
      allowNull: false,
      defaultValue: "UPI",
    },

    transaction_reference: {
      type: DataTypes.STRING,
      allowNull: true, // Example: UPI transaction ID
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "paid",
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default payment_logs;
