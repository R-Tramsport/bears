import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

import ItemsDAO from "./dao/itemsDAO.js"

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(
    process.env.ITEMS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await ItemsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })