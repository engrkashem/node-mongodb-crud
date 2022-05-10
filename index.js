const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.send.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//User id: dbuser1
//password: yU4sSElSnDDqaCNi     yU4sSElSnDDqaCNi(repeat)


const uri = "mongodb+srv://dbuser1:yU4sSElSnDDqaCNi@cluster0.on5h5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const usersCollection = client.db("foodSparks").collection("users");

        //Get users: Load user fron database to server side
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
            // const user = req.query;
            // const result = await usersCollection.findOne(user)
            // res.send(result);
        });

        //get specific users
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        // post user: add a new user to db
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('adding new user ', newUser)
            res.send(result);

        });

        //Update user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        })

        //Delete user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hellow !! running my node crud server');
})

app.listen(port, () => {
    console.log('CRUD server is runnig at ', port);
})