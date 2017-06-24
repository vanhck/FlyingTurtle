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
