import connection
import train
import datetime
import json
import datahandling

from flask import Flask, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from flask_jsonpify import jsonify


db_connect = create_engine('sqlite:///chinook.db')
app = Flask(__name__)
api = Api(app)

@app.route('/orderID')
#args = request.args
#print (args) # For debugging
#no1 = args['key1']
#no2 = args['key2']
#return jsonify(dict(data=[no1, no2])) # or whatever is required
def prediction():
    args = request.args
    orderID = args['orderID']
    weekday = args['weekday']
    #orderID = request.args.get('orderID')
    #weekday = request.args.get('weekday')
    print orderID
    print weekday
    #print(orderID)
    url = "http://52.58.76.156:8080/getOrdersForUser"

    content = connection.connectDatabase(url, orderID)
    orders = json.loads(content)
    data = datahandling.stuffFunction(orders)
    prediction, accuracy = train.trainAlghorithm(data, weekday)
    prediction.append(accuracy)
    return str(prediction)
    print("finished")


if __name__ == '__main__':
     app.run(port='5002')
