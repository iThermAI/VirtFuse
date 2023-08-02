from flask import Flask, Response, abort, jsonify
from pymongo import MongoClient
from moviepy.editor import VideoFileClip
import socket
import time
import os
import cv2
import numpy as np
from datetime import datetime
import pytz

belgium_tz = pytz.timezone('Europe/Brussels')

app = Flask(__name__)

# Initial setting
FlagStart = 0
lastSensorTime = 0
# Sensor Parameters
SensorIP = '127.0.0.1'
SensorPort = '5000'
# Camera parameter
CameraURL = ''
TestVideoPath = './videos/sample1.mp4'
frameNumber = 0
cutted_rect = [580, 850, 1300, 1800]

# cap = cv2.VideoCapture(TestVideoPath)
# if not cap.isOpened():
#     print("Video file is not opened")
# frames = frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
video = VideoFileClip(TestVideoPath)


# Initial Tcp connection setting
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# # Initial database setting
# client = MongoClient("mongodb://localhost:27017/")

# db = client["KyKlosDatabase"]
# collectionTemperature = db["Temperatures"]

# Functions
def check_socket_connection(tcp_socket, host, port):
    return False
    # try:
    #     # Attempt to connect to the server
    #     tcp_socket.connect((host, port))
    #     tcp_socket.close()
    #     return True
    # except socket.error:
    #     return False


def ReadTemperatureSensor(tcp_socket):
    sensorData = tcp_socket.recv(1024)
    return float(sensorData.decode('utf-8').split(' ')[0][1:])


def FilterContour(contours):
    filtered_contours = [
        cnt for cnt in contours if cv2.contourArea(cnt) > 2000]
    return filtered_contours


@app.route('/api/getTemperature')
def getTemprature():
    # global lastSensorTime, FlagStart
    # # Check if we are connected to Sensor
    # if check_socket_connection(tcp_socket, SensorIP, SensorPort):
    #     # Get temperature data
    #     # Temperature = 2.3 # This is for test
    #     # It should be applied on TemperatureData to make it ready for saving in database and send it through websocket
    #     if FlagStart == 1:
    #         Temperature = ReadTemperatureSensor(tcp_socket)
    #         TempratureData = {'Temperature': Temperature, 'Time': 0.0}
    #         lastSensorTime = time.time()
    #         FlagStart = 0
    #     else:
    #         Temperature = ReadTemperatureSensor(tcp_socket)
    #         TempratureData = {'Temperature': Temperature,
    #                           'Time': time.time()-lastSensorTime}

    #     # Second version of handling time
    #     # Temperature = ReadTemperatureSensor(tcp_socket)
    #     # TempratureData = {'Temperature': Temperature, 'Time': str(datetime.now())}
    # else:
    #     # Get temperature data
    #     Temperature = 2.3  # This is for test
    #     # It should be applied on TemperatureData to make it ready for saving in database and send it through websocket
    #     if FlagStart == 1:
    #         # Temperature = ReadTemperatureSensor(tcp_socket)
    #         TempratureData = {'Temperature': Temperature, 'Time': 0.0}
    #         lastSensorTime = time.time()
    #         FlagStart = 0
    #     else:
    #         # Temperature = ReadTemperatureSensor(tcp_socket)
    #         TempratureData = {'Temperature': Temperature,
    #                           'Time': time.time()-lastSensorTime}

    #     # Second version of handling time
    #     # Temperature = ReadTemperatureSensor(tcp_socket)
    #     # TempratureData = {'Temperature': Temperature, 'Time': str(datetime.now())}

    #     # Save in mongodb
    #     # To do list for feature work: Add experiment session number to database getting from the post request

    # # Save in mongodb
    # # To do list for feature work: Add experiment session number to database getting from the post request
    # collectionTemperature.insert_one(TempratureData.copy())

    # # Send data to node server
    # # Choose between the following three lines or the last line.
    # # Send Post request to NodeServer Maybe I should change the following code
    # # response = app.test_client().post(NodeServerURL, json=jsonify(TempratureData))
    # # return response.sta
    # return jsonify(TempratureData)

    Temperature = np.random.randint(0, 101)
    current_time = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(belgium_tz).strftime("%H:%M:%S")
    TempratureData = {'Temperature': Temperature,'Time': current_time}
    return jsonify(TempratureData)


@app.route('/api/getFrame')
def getFrame():
    global frames, frameNumber, cutted_rect
    # Check if we are connected to Camera
    CheckResult = False  # It should be changed to validation check in real test

    if CheckResult:
        vcap = cv2.VideoCapture(CameraURL)
        ret, frame = vcap.read()
    else:
        # This for test
        # cap.set(cv2.CAP_PROP_POS_FRAMES, frameNumber)
        # ret, frame = cap.read()
        frame = video.get_frame(frameNumber)
        
        # if frame is None or frameNumber >= frames:
        #     abort(500, "No more frames left!")
        frameNumber += 1

    # Extract the resin line
    gray_image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    maskSelectedCenter = np.zeros_like(gray_image)
    maskSelectedCenter[cutted_rect[0]:cutted_rect[2],
                       cutted_rect[1]:cutted_rect[3]] = 1

    temp = maskSelectedCenter * gray_image

    _, thresh = cv2.threshold(temp, 150, 255, cv2.THRESH_BINARY)
    contours, hierarchy = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    filteredContours = FilterContour(contours)
    image_with_closed_contours = cv2.drawContours(
        frame.copy(), filteredContours, -1, (0, 255, 0), 2)


    # Insert frames in database

    # Send frame Date to node server
    _, jpeg = cv2.imencode('.jpg', image_with_closed_contours)
    return Response(jpeg.tobytes(), mimetype='image/jpeg')

@app.route('/')
def hello_world():
    return 'The application is running correctly.'

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)