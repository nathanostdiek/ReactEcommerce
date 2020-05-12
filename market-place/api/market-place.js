var express = require('express');
var mongodb = require("mongodb");
var cors = require("cors");
var passwordHash = require('password-hash');
var ObjectId = mongodb.ObjectId;
const socketio = require("socket.io");


var app = express();
app.use(cors());
app.use(express.json());

//database url
const url = "mongodb+srv://mod7:mod7Pass@cluster0-qriqy.mongodb.net/test?retryWrites=true&w=majority";

//set up the database
var MongoClient = mongodb.MongoClient;
var db;
const server = require("http").createServer(app);

//set up socket
const io = socketio(server);
const port = 9000;

server.listen(9000, () => console.log(`Listening on port ${port}`));

//connect to the database
MongoClient.connect(url, function(err, database) {
    if (err) throw err;

    db = database.db("market_place");
});

//sockets to ~update~ feed
io.on("connection", socket=>{
    
    socket.on("getDms", function(data){
        
        let n = data['user'].name;
        let on = data.owner;

        async function run(){
            let ownerdm = await db.collection("messages").find({to: n, from: on}).toArray();
            let userdm = await db.collection("messages").find({from: n, to: on}).toArray();
            socket.emit("dms-back", {udm: userdm, odm: ownerdm});

        }
        run();

    })

    //update feed to all sockets
    socket.on("updateFeed", function(data){
        async function run() {
            let it = await db.collection("items").find({}).toArray();
            io.sockets.emit("additem-toclient", {items: it});
            
        }
        run();
    })
    
})


app.get('/', function (req, res) {
    async function run(){
        var users = db.collection("users");
        var result = await users.find({}).toArray();
        res.send(result[0]);
    }
    
    run();
});

//puts item in DB
app.post('/addItem', function (req, res) {

    async function run(){
        let body = req.body;
        let items = db.collection("items");
        let newData = {
            'item' : body.name,
            'price' : body.price,
            'des': body.description,
            'bid': body.bid,
            'owner' : body.owner,
            'ownerid' : body.ownerid,
            'img' : body.img,
            'sold': false,
            'interest':0,
            'interested_users':[],
            'bidder': "Nobody has bid yet."
        };
        try {
            let inserted = await items.insertOne(newData)
            let newItem = await items.findOne({_id: ObjectId(inserted.insertedId)})
            res.send({
                success: true,
                message: "Item added",
                item: newItem
            })
        }
        catch (e) {
            res.send({
                success: false,
                message: "Item not added",
                error:e
            })
        }

    }

    run();
});

//edits item in DB
app.post('/EditItem', function (req, res) {

    async function run(){
        let body = req.body;
        let items = db.collection("items");
        let newData = {
            '_id' : ObjectId(body.itemid),
            'item' : body.name,
            'price' : body.price,
            'des': body.description,
            'owner' : body.owner,
            'ownerid' : body.ownerid,
            'sold': false,
            'img':body.img,
            'bid':body.bid,
            'interest':body.interest,
            'interested_users':body.interested_users
        };
        try {
            let inserted = await items.replaceOne(
                {_id: ObjectId(body.itemid)},
                newData
                
            )
            
            res.send({
                success: true,
                message: "Item added",
                item: inserted
            })
        }
        catch (e) {
            res.send({
                success: false,
                message: "Item not added",
                error:e
            })
        }

    }

    run();
});

//deletes item from DB
app.post('/deleteItem', function (req, res) {
    async function run(){
        let body=req.body;
        let items=db.collection("items");
        let result = await items.remove({_id: ObjectId(body.itemid)})
        
        if(result.result.n > 0){
            res.send({
                success:true
            })
        }
        else {
            res.send({
                success:false
            })
        }
    }

    run();
})

//sends message to DB
app.post('/sendMessage', function (req, res) {

    async function run(){
        let body = req.body;
        let m = db.collection("messages");
        let newData = {
            'to' : body.to,
            'from' : body.from,
            'mes': body.mes,
            'timestamp': Math.round(((new Date()).getTime()) /1000)
        
        };

        m.insertOne(newData)
        .then(result => res.send({
                            success: true,
                            message: newData
                    }))
        .catch(err => res.send({
            success: false,
            message: "Message not added",
            error: "${err}"
        }))

    }

    run();
});

//returns all the messages
app.post('/getMessages', function (req, res) {

    async function run(){
        let mes = db.collection("messages");
        let re = await mes.find(
            {$or:[{from:req.body.from, to:req.body.to}, {from:req.body.to, to:req.body.from}]}
            ).toArray();
        
        res.send({
            success: true,
            message: re
        });


    }

    run();
});

//gets an array of unique messengers
app.post('/getUniqueMessangers', function (req, res) {
    async function run(){
        let mes = db.collection("messages");
        let re = await mes.distinct("from", {to: req.body.name});
        let re2 = await mes.distinct("to", {from: req.body.name});
        let total = re.concat(re2);

        let distinct = [...new Set(total)];
        
        res.send({
            success: true,
            distinct: distinct
        });


    }

    run();
})

//gets all items
app.post('/getItems', function (req, res) {
    async function run(){
        let items = db.collection("items");
        let todos = await items.find({}).toArray();
        res.send({
            success: true,
            list: todos
        })

    }

    run();
});

//updates an items bid
app.post('/updateBid', function (req, res) {
    async function run(){
        let items = db.collection("items");
        
        let todos = await items.findOneAndUpdate({_id: ObjectId(req.body.id)}, {$set: {price: req.body.newbid, bidder: req.body.bidder}}, {returnNewDocument: true});
        todos.value.bid = req.body.newbid;
        res.send({
            success: true,
            list: todos.value.bid
        })

    }

    run();
});

//sets an item to sold and updates
app.post('/buyItem', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let updated = await items.findOneAndUpdate(
            {_id: ObjectId(body.itemId)},
            {
                $set: {
                    sold: true,
                    sold_to: body.buyer.name,
                    sold_to_id: body.buyer._id
                }
            },
            {returnNewDocument: true}
        );

        if(updated != null) {
            res.send({
                success:true,
                updated_item: updated.value
            });
        }
        else{
            res.send({
                sucess: false,
                message: "something went wrong with mongo"
            })
        }
       
    }

    run();
});

//sells to specific user
app.post('/sellItem', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let updated = await items.findOneAndUpdate(
            {_id: ObjectId(body.itemId)},
            {
                $set: {
                    sold: true,
                    sold_to: body.buyer
                }
            },
            {returnNewDocument: true}
        );

        if(updated != null) {
            res.send({
                success:true,
                updated_item: updated.value
            });
        }
        else{
            res.send({
                sucess: false,
                message: "something went wrong with mongo"
            })
        }
       
    }

    run();
});

//displays interest on item, updates
app.post('/displayInterest', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let updated = await items.findOneAndUpdate(
            {_id: ObjectId(body.itemid)},
            {
                $addToSet:  {
                    interested_users: {name: body.username, id:body.userid}
                }
            },
            {returnNewDocument: true}
        );
        

        if(updated != null) {
            res.send({
                success:true,
                updated_item: updated.value
            });
        }
        else{
            res.send({
                sucess: false,
                message: "something went wrong with mongo"
            })
        }
       
    }

    run();
});

//gets all sold items
app.post('/getSold', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let sold = await items.find(
            {ownerid:body.ownerid, sold:true}
        ).toArray();

        if(sold.length > 0) {
            res.send({
                success:true,
                none: false,
                sold_items: sold
            });
        }
        else{
            res.send({
                success: true,
                none: true,
                message: "You have not sold any items"
            })
        }
       
    }

    run();
})

//gets all selling items
app.post('/getSelling', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let selling = await items.find(
            {ownerid:body.ownerid, sold:false}
        ).toArray();

        if(selling.length > 0) {
            res.send({
                success:true,
                none:false,
                selling_items: selling
            });
        }
        else{
            res.send({
                success: true,
                none: true,
                message: "You are not selling any items"
            })
        }
       
    }

    run();
})


//gets all bought items
app.post('/getBought', function(req, res) {
    async function run() {
        let body = req.body;
        let items = db.collection("items");
        
        let bought = await items.find(
            {sold_to:body.username, sold:true}
        ).toArray();

        if(bought.length > 0) {
            res.send({
                success:true,
                none: false,
                bought_items: bought
            });
        }
        else{
            res.send({
                success: true,
                none: true,
                message: "You have not bought any items"
            })
        }
       
    }

    run();
})

//logs in user and returns it
app.post('/login', function (req, res) {
    function check_credentials(username, password, check_user, pass_hash){
        if(username === check_user) {
            
            if(passwordHash.verify(password, pass_hash)){
                return true;
            }
        }
        return false;
    }


    async function run() {
        let body = req.body;
        let clean_username = String(body.username);
        let clean_password = String(body.password);
        let user_doc = db.collection('users');
        let user = await user_doc.findOne({name:clean_username});

        if (user == null) {
            res.send({
                success: false,
                message: "No account with that username"
            });
        }
        else {
            let passHash = user.password;
            let verify = check_credentials(clean_username, clean_password, user.name, passHash);

            if(verify) {
                res.send({
                    success: true,
                    message: 'loggedIn',
                    user: {name:user.name, _id:user._id}
                });
            }
            else {
                res.send({
                    success: false,
                    message: 'Incorrect Login'
                });
            }
        }
    }
    run();
});

//creates user and returns it
app.post('/create_account', function (req, res) {

    async function run(){
        let body = req.body;
        let users_doc = db.collection('users');
        let clean_user = String(body.username).trim();
        let clean_pass = String(body.password).trim();
        let clean_pass_c = String(body.cpassword).trim();

        if(clean_pass != clean_pass_c) {
            res.send({
                success: false,
                message: 'passwords did not match'
            });
        }
        else {
            let check_db = await users_doc.find({name: clean_user}).count() == 0;
            let hashed_pass = passwordHash.generate(clean_pass);

            if(check_db) {
                let writeResult = await users_doc.insertOne({
                    name: clean_user,
                    password: hashed_pass
                });

                if(writeResult.nInserted==0) {
                    res.send({
                        success: false,
                        message: 'Something went wrong with the database'
                    });
                }
                else {
                    //maybe find and modify
                    let new_user = await users_doc.findOne({name: clean_user});
                    res.send({
                        "success": true,
                        "message": 'Successfully logged in!',
                        "user": {name:new_user.name, _id:new_user._id}
                    });
                }
            }
            else{
                res.send({
                    success: false,
                    message: 'That username already exists'
                });
            }
        }
    }
    run();
});

