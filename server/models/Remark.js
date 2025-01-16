import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
// import { Reply } from "./Reply.js";
// import { Course } from "./Course.js";
// import { Chapter } from "./Chapter.js";
// import { Video } from "./Video.js";
// import { User } from "./User.js";

export const Remark = sequelize.define(
    "remark",
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
        // courseId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "course",
        //         key: "id",
        //     },
        // },
        // chapterId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "chapter",
        //         key: "id",
        //     },
        // },
        // videoId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "video",
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
        tableName: "remark",
    }
);

// Remark.hasMany(Reply, { foreignKey: "remarkId", as: "replies" });
// Remark.belongsTo(User, { foreignKey: "userId", as: "user" });
// Remark.belongsTo(Course, { foreignKey: "courseId", as: "course" });
// Remark.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });
// Remark.belongsTo(Video, { foreignKey: "videoId", as: "video" });
