import express from "express"
import cors from "cors"
import items from "./api/items.route.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/items", items);
app.use("*", (req, res) => res.status(404).json({ error: "Page not found"}));

export default app;