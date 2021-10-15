import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

// reference to database

let items


export default class ItemsDAO {
    static async injectDB(conn) {
        if (items) {
            return;
        }
        try {
            items = await conn.db(process.env.ITEMS_NS).collection("items")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in itemsDAO: ${e}`,
            );
        }
    }

    static async getItems({
        filters = null,
        page = 0,
        itemsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } };
            } else if ("tags" in filters) {
                const s = JSON.stringify({
                    "tags": [
                        "food",
                        "lunch"
                    ]
                });
                const temp_tags = JSON.parse(s);
                query = { "tags": { $in: temp_tags.tags } };
            } else if ("locations" in filters) {
                query = { "locations": { $in: [filters["locations"]] } };
            }
        }

        let cursor;

        try {
            cursor = await items
                .find(query);
        } catch (e) {
            console.error(`Unable to issue find comment ${e}`);
            return { itemsList: [], totalNumItems: 0};
        }

        const displayCursor = cursor.limit(itemsPerPage).skip(itemsPerPage * page);

        try {
            const itemsList = await displayCursor.toArray();
            const totalNumItems = await items.countDocuments(query);
            return { itemsList, totalNumItems };
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { itemsList: [], totalNumItems: 0};
        }
    }

    static async addItem(name, locations, tags) {
        try {
            const itemDoc = {
                name: name,
                locations: locations,
                tags: tags
            };

            return await items.insertOne(itemDoc);
        } catch (e) {
            console.error(`Unable to post item: ${e}`);
            return { error: e };
        }
    }

    static async updateItem(itemId, name, locations, tags) {
        try {
            const updateResponse = await items.updateOne(
                { _id: ObjectId(itemId) },
                { $set: { name: name, 
                    locations: locations, 
                    tags: tags 
                }}
            );

            return updateResponse;
        } catch (e) {
            console.error(`Unable to update item: ${e}`);
            return { error: e };
        }
    }

    static async deleteItem(itemId) {
        try {
            const deleteResponse = await items.deleteOne({
                _id: ObjectId(itemId)
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }
}