import { Sequelize } from "sequelize";
import db from "../config/db.js";

export const Videojuego = db.define(
    "videojuegos",
    {
        id_videojuego: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        titulo: {
            type: Sequelize.STRING,
        },
        imagen: {
            type: Sequelize.STRING,
        },
        trailer: {
            type: Sequelize.STRING,
        },
        /*   precio: {
              type: Sequelize.DECIMAL(10, 2), // Nuevo campo para almacenar precios
          }, */
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

export default Videojuego;
