// ----------------------------------
// Mongoose setup
// ----------------------------------

// Import the Mongoose library
const mongoose = require("mongoose")

// URL of your database
const mongoURL = "mongodb+srv://dbUser:0000@cluster0.manjc.mongodb.net/lucklandlord?retryWrites=true&w=majority"

// Configuration options to use when connecting to the database
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// import the Schema class
const Schema = mongoose.Schema;


// Define the table
const LuckLandlordSchema = new Schema({
    name: { type: String, required: true },
    rarity: { type: String, required: true },
    description: String,
    goldPerTurn: Number
})

// Create the table and return the schema as a Mongoose model
const LuckLandlord = mongoose.model("luckLandlord_table", LuckLandlordSchema)


// ----------------------------------
// Express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;

// ----------------------------------
// URL endpoints
// ----------------------------------

// GET ALL ITEMS IN DB
app.get("/api/items", (req, res) => {
    LuckLandlord.find().exec().then(
        (results) => {

            if (results === null) {
                const msg = {
                    statusCode: 404,
                    msg: "No items saved in the database"
                }
                res.status(404).send(msg)
            }

            else {
                console.log(results)
                res.status(200).send(results)
            }
        }
    ).catch(
        (err) => {
            console.log(err)
            const msg = {
                statusCode: 500,
                msg: "Error when getting items from database."
            }
            res.status(500).send(msg)
        }
    )
})

// GET ONE ITEM BY NAME
app.get("/api/items/:item_name", (req, res) => {

    // 1. Determine which student the user wants
    // by looking at the URL parameters
    console.log(`Searching for: ${req.params.item_name}`)

    // 2. Then you make the query to the database

    // This is mongoose syntax, its not express, its not javascript
    LuckLandlord.findOne({ "name": req.params.item_name }).exec()
        .then(
            (result) => {
                if (result === null) {
                    console.log("Item not found in the database")
                    const msg = {
                        statusCode: 404,
                        msg: "Item not found in the database"
                    }
                    res.status(404).send(msg)
                }
                else {
                    console.log("Item found")
                    console.log(result)
                    res.status(200).send(result)
                }
            }
        ).catch(
            (err) => {
                console.log(`Error`)
                console.log(err)
                const msg = {
                    statusCode: 500,
                    msg: "Error when retrieving items from database"
                }
                res.status(500).send(msg)
            }
        )
})

// INSERT ITEM BY NAME
app.post("/api/items", (req, res) => {

    // 1. what did the client send us
    // - what data does the client want us insert into the database
    console.log("I received this from the client:")
    console.log(req.body)

    // 2. Take that information and CREATE someone in your database!
    // - mongoose

    LuckLandlord.create(req.body).then(
        (result) => {
            //javascript
            console.log("Create success!")
            console.log(result)
            const msg = {
                statusCode: 201,
                msg: "Item sucessfully inserted"
            }
            // express
            res.status(201).send(msg)
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode: 500,
                msg: "Error inserting item into the database."
            }
            res.status(500).send(msg)
        }
    )
})


// DELETE BY NAME
app.delete("/api/items/:item_name", (req, res) => {

    // 1. Determine which item the user wants to delete 
    // by looking at the URL parameters
    console.log(`Searching for: ${req.params.item_name}`)

    LuckLandlord.deleteOne({ "name": req.params.item_name }).exec().then(
        (result) => {

            console.log(`Before if statement \n ${result.body}`)
            if (result.deletedCount === 0) {
                console.log("Cannot delete selected record, as it does not exist")
                const msg = {
                    statusCode: 404,
                    msg: "Cannot delete selected record, as it does not exist"
                }
                res.status(404).send(msg)
            }
            else {
                console.log("Item successfully deleted!")
                console.log(result)
                const msg = {
                    statusCode: 200,
                    msg: `${req.params.item_name} successfully deleted.`
                }
                res.status(200).send(msg)
            }
        }

    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode: 500,
                msg: "Error deleting item from database"
            }
            res.status(500).send(msg)
        }
    )
})

// UPDATE AN ITEM BY ID
app.put("/api/items/:item_id", (req, res) => {
    const msg = {
        statusCode: 501,
        msg: "Not implemented yet. Please check back in the near future!"
    }
    console.log(msg)
    res.status(501).send(msg)
})


// ----------------------------------
// OTHER URL endpoints
// ----------------------------------
app.use((req, res) => {
    const message = {
        statusCode: 404,
        message: "The requested endpoint does not exist"
    }
    res.status(404).send(message)
});




// ----------------------------------
// connect to database & start server
// ----------------------------------
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

// 1. Connect to the Database
// connect to the database and check that it worked
mongoose.connect(mongoURL, connectionOptions).then(
    () => {
        console.log("Connected successfully to your database.")
        app.listen(HTTP_PORT, onHttpStart);
    }
).catch(
    (err) => {
        console.log("Error connecting to the database")
        console.log(err)
    }
)

