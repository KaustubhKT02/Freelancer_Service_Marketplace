import { db } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const project_delivery = db.define(
  "project_delivery",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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

    text_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "delivered",
        "accepted",
        "rejected",
        "revision_requested"
      ),
      defaultValue: "delivered",
    },
  },
  { timestamps: true }
);

export default project_delivery;
