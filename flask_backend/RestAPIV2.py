import threading
import time
import os
import socket
from flask import Flask, jsonify, request, Response
from pymongo import MongoClient
import cv2
from datetime import datetime
from bson.binary import Binary
import pickle


# Code characteristic 
## This code is implemented in a way that only one person can give the order of the recording and during one recording, no one can give the order of recording. 

# Initial Variable or setting
## Variable for handling code dynamic
index = 0
PartNumber = 0
FlagStart = 1
StateRun = False 
## Flask App
app = Flask(__name__)
## Event variable for start/stop handling process
stop_event = threading.Event()
## Sensor Parameters
SensorIP = '127.0.0.1' # 👈 it needs to set real IP
SensorPort = '5000' # 👈 it needs to real port
# Camera parameter
CameraURL = '' # 👈 it needs to set real url 
ImagePath = 'D:\\DoctoralSharif\\NoranCompany\\Proposal\\KyKlos\\virtfuse\\Backend\\first-view.jpg' # 👈 it should be removed

# Threading parameters
my_thread = 0


# Database Parameters and Structure
## Set mongo url
# mongo_url = os.environ.get('MONGO_URL') 👈 it needs to contract with image mongodb in docker compose
mongo_url = "mongodb://localhost:27017/"


## Set the structure of the mongodb data base
client = MongoClient(mongo_url)
db = client["KyKLos"]
Experiments = db["Experiments"]
frames = db["frames"]
temps = db["tempratures"]
## The resulted structures
# Experiments_doc = {
#     "PartNumber": 1,
#     "CreationDate": datetime.now(),
#     "Status": 'Running'
# }

# data_doc = {
#     "index": 0,
#     "timeFromStartTemp": 0,
#     "timeFromStartFrame": 0,
#     "Temprature": 0,
#     "frame": 
# }





# Initial Tcp connection setting
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)



# Functions
## Check connection to sensors
def check_socket_connection(tcp_socket, host, port):
    return False
    # try:
    #     # Attempt to connect to the server
    #     tcp_socket.connect((host, port))
    #     tcp_socket.close()
    #     return True
    # except socket.error:
    #     return False

## Connect to Sensor Data
def ReadTemperatureSensor(tcp_socket):
    sensorData = tcp_socket.recv(1024)
    return float(sensorData.decode('utf-8').split(' ')[0][1:])


def Recording(Table):
            global stop_event,StateRun,ImagePath,FlagStart,PartNumber,index
            while not stop_event.is_set():  # Check the stop condition
                # Here I should gather sensor data and put into database.
                # Gather Sensor Data
                ## First Check connection to sensor and get data if it is available
                if(check_socket_connection(tcp_socket, SensorIP, SensorPort)):
                    Temperature = ReadTemperatureSensor(tcp_socket)  
                else:
                    Temperature = 2.3
                    print("Temparature is getting") 
                
                ## Get time to record temprature
                TimeTemp = time.time()
                
                # Gather Camera Data
                CheckResult = False  # It should be changed to validation check in real test
                if CheckResult:
                    vcap = cv2.VideoCapture(CameraURL)
                    ret, frame = vcap.read()
                else:
                    # This for test
                    frame = cv2.imread(ImagePath)
                    print(f"Frame is recorded")

                ## Get time to record frame    
                TimeFrame = time.time()
                
                # Convert frame data to binary data
                frame = Binary(pickle.dumps(frame)) 

                # Insert Data into database
                ## Set data docs
                data_doc = {
                    "index": index,
                    "timeFromStartTemp": 0,
                    "timeFromStartFrame": 0,
                    "Temprature": Temperature,
                    "frame": frame
                }
                ## Fill Temprature and Frame Data
                if FlagStart == 1:
                    data_doc['timeFromStartFrame'] = 0.0
                    data_doc['timeFromStartTemp'] = 0.0
                    lastVideoTime = TimeFrame
                    lastSensorTime =  TimeTemp 
                    FlagStart = 0
                else:
                    data_doc['timeFromStartFrame'] = TimeFrame-lastVideoTime
                    data_doc['timeFromStartTemp'] = TimeTemp  -lastSensorTime 
                ## Insert Docs to the 
                Table.insert_one(data_doc)
                index += 1
                time.sleep(1)   
            stop_event.clear()
            PartNumber += 1
            ## Change Status to done
            Experiments.update_one({"Status": "Running"}, {"$set": {"Status": "Done"}})



@app.route('/Start', methods=['GET'])  # It should be changed to "get"
def Start():
    global stop_event,StateRun,ImagePath,FlagStart,PartNumber,index,my_thread
    if not StateRun:
        StateRun = True
        # Create and insert Experiment Docs
        Experiments_doc = {
            "PartNumber": PartNumber,
            "CreationDate": datetime.now(),
            "Status": 'Running'
        }
        Experiment_id = Experiments.insert_one(Experiments_doc).inserted_id
        idTable = str( Experiment_id)
        Table = db[idTable]
        # Recording
        my_thread = threading.Thread(target=Recording, kwargs={"Table": Table})
        my_thread.start()

        print("Threaded function has stopped")
        return jsonify({"id":idTable}), 200
    return "NotOK" 

@app.route('/Stop', methods=['GET'])  # It should be changed to "get"
def End():
    global stop_event,StateRun,FlagStart,index,my_thread
    if StateRun:
        stop_event.set()
        my_thread.join()
        FlagStart = 1
        index = 0
        StateRun = False
        return "OK", 200
    else:
        return "NotOK", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = "0.0.0.0"  # it should change to backend server address
    stop_event = threading.Event()
    print("I am before runnig") 
    app.run(debug=True, host=host, port=port)
    print("I am running")