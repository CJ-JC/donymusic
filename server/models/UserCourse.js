import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
import { Course } from "./Course.js";

export const UserCourse = sequelize.define(
    "user_course",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true,
        tableName: "user_course",
    }
);

// Définition de la relation
User.belongsToMany(Course, {
    through: UserCourse, // Utiliser le modèle de liaison
    foreignKey: "userId",
    as: "enrolledCourses", // Alias pour les cours inscrits
});

Course.belongsToMany(User, {
    through: UserCourse, // Utiliser le modèle de liaison
    foreignKey: "courseId",
    as: "students", // Alias pour les utilisateurs inscrits
});
