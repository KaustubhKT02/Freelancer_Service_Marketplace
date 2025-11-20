import { db } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const proposals = db.define(
  "proposals",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    bid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 1 },
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "rejected",
        "awaiting_payment",
        "paid",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["project_id", "freelancer_id"],
      },
    ],
  }
);

export default proposals;
