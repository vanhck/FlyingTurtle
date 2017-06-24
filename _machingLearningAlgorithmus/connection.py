import urllib
import urllib2
def connectDatabase(url, userID):
    try:
        values = {"userID": userID}
        data = urllib.urlencode(values)
        connection = urllib2.Request(url, data)
        openConnection = urllib2.urlopen(connection)
        content = openConnection.read()
        print("success")

    except:
        print ("Problem")
    #print content
    return content
