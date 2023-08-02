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
import logging
import base64
import pandas as pd
import asyncio
logging.basicConfig(level=logging.DEBUG)


# Code characteristic
# This code is implemented in a way that only one person can give the order of the recording and during one recording, no one can give the order of recording.

# Initial Variable or setting
# Variable for handling code dynamic
index = 0
PartNumber = 0
FlagStart = 1
StateRun = False
# Flask App
app = Flask(__name__)
# Event variable for start/stop handling process
stop_event = threading.Event()
# Sensor Parameters
SensorIP = '127.0.0.1'  # 👈 it needs to set real IP
SensorPort = '5000'  # 👈 it needs to real port
# Camera parameter
CameraURL = ''  # 👈 it needs to set real url
# 👈 it should be removed
ImagePath = "./first-view.jpg"

# Threading parameters
my_thread = 0


# Database Connection
MONGO_HOST = 'mongodb'
MONGO_PORT = 27017
MONGO_USERNAME = os.environ.get('MONGO_USERNAME')
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')
MONGO_AUTH_SOURCE = 'admin'
client = MongoClient(
    host=MONGO_HOST,
    port=MONGO_PORT,
    username=MONGO_USERNAME,
    password=MONGO_PASSWORD,
    authSource=MONGO_AUTH_SOURCE,
)

# Check Connection
# try:
#     client.admin.command('ismaster')
#     app.logger.debug("Connected to MongoDB.")
# except ServerSelectionTimeoutError:
#     app.logger.debug("Failed to connect to MongoDB.")
if client.server_info():
    app.logger.debug("Connected to MongoDB.")
else:
    app.logger.debug("Failed to connect to MongoDB.")

# Database Structure
db = client["Kyklos"]
Experiments = db["Experiments"]

# The resulted structures
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
# Check connection to sensors
def check_socket_connection(tcp_socket, host, port):
    return False
    # try:
    #     # Attempt to connect to the server
    #     tcp_socket.connect((host, port))
    #     tcp_socket.close()
    #     return True
    # except socket.error:
    #     return False

# Connect to Sensor Data
def ReadTemperatureSensor(tcp_socket):
    sensorData = tcp_socket.recv(1024)
    return float(sensorData.decode('utf-8').split(' ')[0][1:])

df = pd.read_csv('./DashboardDemo.csv', header=None, names=['time', 'cureTemp', 'resinTemp'])
n_rows = df.shape[0]
frameNumber = 0
total = 780
# video file
video_rgb = cv2.VideoCapture('./videos/Video1.mp4')
fps_rgb = video_rgb.get(cv2.CAP_PROP_FPS)
video_th = cv2.VideoCapture('./videos/DashboardDemoThermal.mp4')
fps_th = video_th.get(cv2.CAP_PROP_FPS)
app.logger.debug(f"FPS of RGB: {fps_rgb}, FPS of TH: {fps_th}")
fps_rgb = 60
video_rgb.set(cv2.CAP_PROP_POS_FRAMES, 10)
ret_rgb, frame_rgb = video_rgb.read()
cv2.imwrite('frame_rgb.jpg', frame_rgb)
resized_frame = cv2.resize(frame_rgb, (672, 380)) 
cv2.imwrite('resized_frame2.jpg', resized_frame)

async def get_rgb_frame():
    video_rgb.set(cv2.CAP_PROP_POS_FRAMES, frameNumber)
    ret_rgb, frame_rgb = video_rgb.read()
    frame_rgb = cv2.resize(frame_rgb, (672, 380)) 
    _, jpeg_rgb = cv2.imencode('.jpg', frame_rgb)
    encoded_image_rgb = base64.b64encode(jpeg_rgb.tobytes()).decode('utf-8')
    return encoded_image_rgb

async def get_th_frame():
    video_th.set(cv2.CAP_PROP_POS_FRAMES, frameNumber)
    ret_th, frame_th = video_th.read()
    frame_th = cv2.resize(frame_th, (672, 380)) 
    _, jpeg_th = cv2.imencode('.jpg', frame_th)
    encoded_image_th = base64.b64encode(jpeg_th.tobytes()).decode('utf-8')
    return encoded_image_th

async def Recording(Table):
    global stop_event, StateRun, ImagePath, FlagStart, PartNumber, index, frameNumber
    while not stop_event.is_set():
        sample = df.iloc[frameNumber]
        CuringSensorTemprature = sample["cureTemp"]
        ResinSensorTemprature = sample["resinTemp"]
        TimeTemp = time.time()

        encoded_image_rgb, encoded_image_th = await asyncio.gather(get_rgb_frame(), get_th_frame())

        # Insert Data into database
        # Set data docs
        data_doc = {
            "index": index,
            "timeFromStartTemp": 0,
            "timeFromStartFrame": 0,
            "resinTemp": ResinSensorTemprature,
            "cureTemp": CuringSensorTemprature,
            "image_rgb": encoded_image_rgb, 
            "image_th": encoded_image_th
        }
        # Fill Temprature and Frame Data
        if FlagStart == 1:
            data_doc['timeFromStartFrame'] = 0.0
            data_doc['timeFromStartTemp'] = 0.0
            # lastVideoTime = TimeFrame
            lastSensorTime = TimeTemp
            FlagStart = 0
        else:
            # data_doc['timeFromStartFrame'] = TimeFrame-lastVideoTime
            data_doc['timeFromStartTemp'] = TimeTemp - lastSensorTime
        # Insert Docs to the
        app.logger.debug(f"{CuringSensorTemprature}, {ResinSensorTemprature}, {data_doc['timeFromStartTemp']}")
        Table.insert_one(data_doc)
        index += 1
        frameNumber += 1
        # time.sleep(0.5)
        asyncio.sleep(0.5)
    stop_event.clear()
    frameNumber = 0
    PartNumber += 1
    # Change Status to done
    Experiments.update_one({"Status": "Running"}, {"$set": {"Status": "Done"}})

@app.route('/api/initiate', methods=['GET'])  # It should be changed to "get"
def Initiate():
    returnObj = {
        "catRatio": "35",
        "initialRoomTemp": "25 C",
        "initialResinTemp" : "83 C"
    }
    return jsonify(returnObj), 200

@app.route('/api/start', methods=['GET'])  # It should be changed to "get"
def Start():
    global stop_event, StateRun, ImagePath, FlagStart, PartNumber, index, my_thread
    if not StateRun:
        StateRun = True
        # Create and insert Experiment Docs
        Experiments_doc = {
            "PartNumber": PartNumber,
            "CreationDate": datetime.now(),
            "Status": 'Running'
        }
        Experiment_id = Experiments.insert_one(Experiments_doc).inserted_id
        idTable = str(Experiment_id)
        Table = db[idTable]
        # Recording
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        my_thread = threading.Thread(target=loop.run_until_complete, args=(Recording(Table),))
        # my_thread = threading.Thread(target=Recording, kwargs={"Table": Table})
        my_thread.start()

        app.logger.debug(f"The table id is: {idTable}")

        return jsonify({"id": idTable}), 200
    return "Running experiment already exists", 500


@app.route('/api/finish', methods=['GET'])  # It should be changed to "get"
def End():
    global stop_event, StateRun, FlagStart, index, my_thread
    if StateRun:
        stop_event.set()
        my_thread.join()
        my_thread = None
        FlagStart = 1
        index = 0
        StateRun = False
        frameNumber = 0
        # return the summary data
        return "Stopped", 200
    else:
        return "No running experiment.", 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = "0.0.0.0"  # it should change to backend server address
    stop_event = threading.Event()
    app.run(debug=True, host=host, port=port)
