import ItemsDAO from "../dao/itemsDAO.js";

export default class ItemsController {
    static async apiGetItems(req, res, next) {
        // Constant to store the number of restuarants displayed for each page
        // This value is passed through the url (?restaurantsPerPage=10)
        // If a value exists, parse it as an integer, otherwise set it to 20
        const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage, 10) : 20;
        // Similarly with the page number
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        // Filters start as an empty object
        let filters = {};
        if (req.query.locations) {
            filters.locations = req.query.locations;
        } else if (req.query.tags) {
            filters.tags = req.query.tags;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        // Using the filters and query values, call the restaurant data access object
        const { itemsList, totalNumItems } = await ItemsDAO.getItems({
            filters,
            page,
            itemsPerPage,
        });

        let response = {
            Items: itemsList,
            page: page,
            filters, filters,
            entries_per_page: itemsPerPage,
            total_results: totalNumItems,
        }
        res.json(response);
    }

    static async apiPostItem(req, res, next) {
        try {
            // const item_name = req.body.name;
            // const item_locations = req.body.locations;
            // const item_tags = req.body.tags;

            const tempLocs = JSON.stringify({ 
                "locations": [
                    "Castle Hill",
                    "City"
                ]
            });

            const tempTags = JSON.stringify({ 
                "tags": [
                    "drink",
                    "bubble tea"
                ]
            });

            const item_name = "Gong Cha";
            const item_locations = JSON.parse(tempLocs);
            const item_tags = JSON.parse(tempTags);

            const ItemResponse = await ItemsDAO.addItem(
                item_name,
                item_locations.locations,
                item_tags.tags
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateItem(req, res, next) {
        try {
            const itemId = req.body.item_id;
            const newName = req.body.name;
            // const newLocations = req.body.item_locations;
            // const newTags = req.body.item_tags;

            const tempLocs = JSON.stringify({ 
                "locations": [
                    "Castle Hill",
                    "City"
                ]
            });

            const tempTags = JSON.stringify({ 
                "tags": [
                    "drink",
                    "bubble tea",
                    "snack"
                ]
            });

            const newLocations = JSON.parse(tempLocs).locations;
            const newTags = JSON.parse(tempTags).tags;

            const itemResponse = await ItemsDAO.updateItem(
                itemId,
                newName,
                newLocations,
                newTags
            );

            var { error } = itemResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (itemResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update item"
                )
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteItem(req, res, next) {
        try {
            const itemId = req.query.id;

            const itemResponse = await ItemsDAO.deleteItem(
                itemId
            )

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}