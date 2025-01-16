import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
// import { Remark } from "./Remark.js";
// import { User } from "./User.js";

export const Reply = sequelize.define(
    "reply",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "user",
        //         key: "id",
        //     },
        // },
        // remarkId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "remark",
        //         key: "id",
        //     },
        // },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true,
        tableName: "reply",
    }
);

// Reply.belongsTo(Remark, { foreignKey: "remarkId", as: "remark" });
// Reply.belongsTo(User, { foreignKey: "userId", as: "user" });
