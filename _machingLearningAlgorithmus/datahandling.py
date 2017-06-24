import time
from datetime import datetime
import numpy as np
import pandas as pd
def stuffFunction(orders):
    #arr = np.empty((0,3), int)
    #A = np.empty((0,2))
    data = np.array(["", "Weekday", "Ordertime"])
    for order in orders:
            timestamp = order['startTime']
            if timestamp is not None:
                timestamp2 = time.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
                timestamp = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
                #orderTime = timestamp.time()
                #orderTime = orderTime.utcfromtimestamp(0)
                hour = timestamp2[3]
                minute = timestamp2[4]
                if hour <= 9:
                    orderTime = 1
                elif hour > 9 and hour <= 13:
                    orderTime = 2
                elif hour > 13 and hour <= 16:
                    orderTime = 3
                elif hour > 16:
                    orderTime = 4
                #print orderTime
                weekday = timestamp2[6]
                newrow = [order['orderID'], weekday, orderTime]
                data = np.vstack([data, newrow])
    pdf = pd.DataFrame(data=data[1:,1:], index=data[1:,0], columns=data[0,1:])
    return pdf
