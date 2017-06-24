var url = "http://52.58.76.156:8080"
// var url = "http://localhost:8080"



var parse = require('csv-parse/lib/sync');

var fs = require('fs');

var csvFile = fs.readFileSync('sample.csv', 'utf8');
var records = parse(csvFile);
var request = require('request');

var Bottleneck = require("bottleneck"); // Skip when browser side 

// Never more than 1 request running at a time. 
// Wait at least 2000ms between each request. 
var recordLimiter = new Bottleneck(100, 1);
// var userLimiter = new Bottleneck(1, 200);

// for (var i = 0; i < records.length; i++) {
//     recordLimiter.submit(addUser, [records[0], records[1]], function(userID) {
//     	for (var j = 0; j < records[i])
//     	userLimiter.submit(addOrder, userID, )
//     })
// }




function* recordMaker(arr) {
    var index = 0;
    while (index < arr.length)
        yield arr[index++];
}

var gen = recordMaker(records);






handleRecord(gen.next().value)

function createAddOrder(userID, startTime) {

	return function() {
		addOrder(userID, startTime)
	}

}

function handleRecord(record) {
	if (record === undefined) return
    addUser([record[0], record[1]], function(userID) {

    	// function* orderMaker(arr) {
    	//     var index = 0;
    	//     while (index < arr.length)
    	//         yield arr[index++];
    	// }

    	// console.log(userID)
    	record.splice(0, 1);
    	record.splice(0, 1);
    	for (var i = 0; i < record.length; i++) {
    		recordLimiter.submit(addOrder, userID, record[i], function() {
    			console.log("added with userID " + userID)
    		});
    		// createAddOrder(userID, record[i])()
    		// handleOrder(userID, )
    	}

    	handleRecord(gen.next().value)
    	// var orderGen = orderMaker(record)
    	// console.log(record)
    	// console.log(orderGen)
    	// console.log(orderGen.next())
    	// handleOrder(userID, orderGen.next().value, orderGen)

    })
}


// function handleOrder(userID, order, orderGen) {
// 	addOrder(userID, order, function() {
// 		handleOrder(userID, orderGen.next().value, orderGen)
// 	})
// }

// for (var i = 0; i < records.length; i++) {
//     addUser([records[i][0], records[i][1]], function(userID) {
// 		console.log(records[i])
//         for (var j = 2; j < records[i].length; j++) {
//             addOrder(userID, records[i][j])
//         }
//     })
// }


function addUser(userInfo, cb) {
    request.post(
        url + "/addNewUser", {
            json: {
                name: "",
                surname: "",
                lat: userInfo[0],
                lon: userInfo[1]
            }
        },
        function(error, response, body) {
            if (error) console.log(error)
            if (!error && response.statusCode == 200) {
                cb(body.lastUserID)
            }
        }
    );
}

function addOrder(userID, startTime, cb) {
    request.post(
        url + "/addNewOrder", {
            json: {
                userID: userID,
                startTime: startTime,
                endTime: startTime,
                state: "pending"
            }
        },
        function(error, response, body) {
            if (error) console.log(error)
            if (!error && response.statusCode == 200) {
                // console.log(body)
                cb()
            }
        }
    );
}
