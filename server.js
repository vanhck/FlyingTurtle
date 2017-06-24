// so werden module in nodeJS integriert, module können vorher per 'npm' installiert werden, siehe readme, 
// sollten aber schon eingecheckt sein

// sqlite direkt mit npm, muss nichts installiert werden
var sqlite3 = require('sqlite3').verbose();
// body parser wird genutzt um parameter aus request (vor allem POST) zu kriegen
var bodyParser = require('body-parser')

var moment = require('moment');

// wir definieren hier die datenbank. aktuell in memory (var db = new sqlite3.Database(':memory:');)
var db;
// var db_path_identifier = ':memory:'
var db_path_identifier = '/vanhck/db.sqlite'
    // var events_table_identifier = "events"
    // var requests_table_identifier = "requests"
    // var email_table_identifier = "email"

var user_table_identifier = "users"
var order_table_identifier = "orders"
var package_table_identifier = "packages"

var path = require('path');

function createDb() {
    console.log("create DB: " + db_path_identifier)
    db = new sqlite3.Database(db_path_identifier, createTables);
}


function createTables() {
    console.log("create table if not exists: " + user_table_identifier)
    db.run("CREATE TABLE IF NOT EXISTS " + user_table_identifier + " (userID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, lat Decimal(9,6), lon Decimal(9,6))");

    console.log("create table if not exists: " + order_table_identifier)
    db.run("CREATE TABLE IF NOT EXISTS " + order_table_identifier + " (orderID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, startTime DATE, endTime DATE, state TEXT)");

    console.log("create table if not exists: " + package_table_identifier)
    db.run("CREATE TABLE IF NOT EXISTS " + package_table_identifier + " (packageID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER)");
}



createDb();

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

function insertNewUser(user, cb) {
    console.log("insert new user to db")
    var stmt = db.prepare("INSERT INTO " + user_table_identifier + "(name, surname, lat, lon) VALUES (?, ?, ?, ?)");
    stmt.run(
        user.name,
        user.surname,
        user.lat,
        user.lon,
        function(err) {
            cb(this.lastID)
        }
    );
    stmt.finalize()


}

function deleteUser(userID, cb) {
    console.log("insert new user to db")
    db.run("delete FROM users WHERE userID = " + userID, function(err) {
        db.run("delete FROM orders WHERE userID = " + userID, function(err) {
            cb()
        });
    });
}


function insertNewOrder(order, cb) {
    console.log("insert new order")
    var stmt = db.prepare("INSERT INTO " + order_table_identifier + "(userID, startTime, endTime, state) VALUES (?, ?, ?, ?)")
    stmt.run(
        order.userID,
        order.startTime,
        order.endTime,
        order.state
    )
    stmt.finalize()
    cb()
}

function insertNewPackage(package, cb) {
    console.log("insert new package")
    var stmt = db.prepare("INSERT INTO " + package_table_identifier + "(userID) VALUES (?)")
    stmt.run(
        package.userID
    )
    stmt.finalize()
    cb()
}

function getOrdersForUser(userID, responseCallback) {
    orders = []
    db.each("SELECT * FROM " + order_table_identifier + " WHERE userID = " + userID, function(err, row) {
        console.log(row);
        orders.push(row)
    }, function() {
        console.log("completed for user " + userID + " and found " + orders.length + " orders")
        responseCallback(orders)
    });
}

function getOrdersForInterval(intervalStart, intervalEnd, responseCallback) {
    intervalOrders = []
    db.each("SELECT * FROM orders INNER JOIN users on orders.userID = users.userID WHERE startTime BETWEEN " + intervalStart + " AND " + intervalEnd + " ORDER BY startTime", function(err, row) {
        console.log(row);
        intervalOrders.push(row)
    }, function() {
        console.log("completed for intervalStart " + intervalStart + " and intervalEnd " + intervalEnd + " and found " + intervalOrders.length + " intervalOrders")
        responseCallback(intervalOrders)
    });
}

function getAllUsers(responseCallback) {
    users = []
    db.each("SELECT * FROM users", function(err, row) {
        console.log(row);
        users.push(row)
    }, function() {
        console.log("completed and found " + users.length + " users")
        responseCallback(users)
    });
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


// express ist ein web framework on top of node
// d.h., man definiert routen und HTTP verben (GET/POST) und dann die function die dabei aufgerufen wird
// wir kommunizieren aktuell rein mit JSON, ggf. könnte man hier drüber auch ne kleine html seite zurückgeben
// bei entsprechen anderer route
const express = require('express');

// Constants
const PORT = 8080;

// App
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use('/register', express.static(path.join(__dirname, "..", "Registrierung")))

app.use('/icons', express.static(path.join(__dirname, "icons")))

app.get('/', function(req, res) {
    res.send('Hello world\n');
});

app.post("/addNewUser", function(req, res) {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400)
    if (exists(req.body)) {
        var user = {
            name: req.body.name,
            surname: req.body.surname,
            lat: req.body.lat,
            lon: req.body.lon
        }
        insertNewUser(user, function(lastUserID) {
            console.log("successfully added new user")
            res.setHeader('Content-Type', 'application/json');
            res.json({ lastUserID: lastUserID })
        })
    }
})


app.post("/deleteUser", function(req, res) {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400)
    if (exists(req.body)) {
        deleteUser(req.body.userID, function() {
            console.log("successfully delete user")
            res.send("success")
        })
    }
})

app.post("/addNewOrder", function(req, res) {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400)
    if (exists(req.body)) {
        var order = {
            userID: req.body.userID,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            state: req.body.state
        }
        insertNewOrder(order, function() {
            console.log("successfully added new order")
            console.log(order)
            res.send("success")
        })
    }
})

app.post("/getOrdersForUser", function(req, res) {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400)
    if (exists(req.body)) {
        getOrdersForUser(req.body.userID, function(orders) {
            for (var i = 0; i < orders.length; i++) {
                orders[i].startTime = new Date(orders[i].startTime)
                orders[i].endTime = new Date(orders[i].endTime)
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(orders)
        })
    }
})

app.post("/getOrdersForTimeRange", function(req, res) {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400)
    if (exists(req.body)) {
        getOrdersForInterval(req.body.intervalStart, req.body.intervalEnd, function(intervalOrders) {
            for (var i = 0; i < intervalOrders.length; i++) {
                intervalOrders[i].startTime = new Date(intervalOrders[i].startTime)
                intervalOrders[i].endTime = new Date(intervalOrders[i].endTime)
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(intervalOrders)
        })
    }
})


app.get("/getAllUsers", function(req, res) {

    getAllUsers(function(users) {
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
})

app.post("/addPackage", function(req, res) {

    console.log(req.body)
        if (!req.body) return res.sendStatus(400)
        if (exists(req.body)) {
            var package = {
                userID: req.body.userID
            }
            insertNewPackage(package, function() {
                console.log("successfully added new package")
                console.log(package)
                sendFCM()
                res.send("success")
            })
        }

})

function sendFCM() {
    var request = require('request');

    var payload = {
        "notification": {
            "title": "Flying Turtle",
            "body": "Ein Paket ist eingetroffen und kann zugestellt werden"
        },
        "to": "dW0p9MXlaBc:APA91bGsOwaJSX0m5Qf_B4X5izhpZDYJeEwYVrCuUm-1kRw18fgpgAzggCZnIU4uT71hOZWoZK_vvQk6UepNKco71d6ispPdvoiUP3mHgi-u6u-iKmEwXfLxmXKOeZa5L14Ky1_8sryg"
    }

    console.log(payload)

    request({
        url: "https://fcm.googleapis.com/fcm/send",
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'key=AAAAO3abcrY:APA91bG3tcQJV7F0_lmBVsBHKPiBON0IcJ2M9GYAAIV6GkJLmsKvx3HXxPmHlUBOCZ75-6AT5coENLDUCGeUJrCg2udIbkonub5dAXVGxnVHaKHrIkxLcNcqhtbRfZtyQdT9hOcejZw2'
        },
        json: payload
    }, function(error, response, body) {
        if (error) {
            console.log("error")
            console.log(error)
        }
        console.log(response);
    });

}


app.get("/map", function(req, res) {
 res.sendFile(path.join(__dirname,  "index.html"));
})

app.listen(PORT);
console.log('Running on ' + PORT);




function exists(obj) {
    return obj !== null && obj !== undefined
}
