# 🚀 CanSat Telemetry Simulation Server

A lightweight **asynchronous telemetry simulation system** that mimics how a CanSat transmits environmental and motion data to a ground station using WebSockets.

This project is designed to help understand:

* Real-time data streaming
* Telemetry system design
* Client-server communication
* Data visualization pipelines

---

# 📡 Overview

The system consists of two components:

### 🛰️ Server (`server.py`)

Simulates a CanSat transmitting telemetry data at high frequency.

### 🖥️ Client (`client.py`)

Acts as a ground station receiving and displaying telemetry data.

---

# ⚙️ Features

* Real-time telemetry streaming using **WebSockets**
* Asynchronous architecture using `asyncio`
* Simulated sensor data:

  * Altitude
  * Temperature
  * Pressure
  * Humidity
  * GPS coordinates
  * Acceleration (3-axis)
  * Gyroscope (3-axis)
  * Voltage & Current
  * Light intensity
  * Timestamp
* Continuous data broadcast at a maximum frequency of 10Hz

---

# 🧠 How It Works

### 🔁 Data Flow

```
Sensor Simulator → Server → WebSocket → Client → Console Output
```

---

## 🛰️ Server Logic

The server:

1. Generates simulated telemetry data using:

```python
sensor_simulator()
```

2. Streams data continuously via:

```python
async def stream_data(websocket)
```

3. Sends struct data as binary packets:

```python
await websocket.send(bin_data)
```

4. Runs on:

```
ws://0.0.0.0:4443
```

---

## 🖥️ Client Logic

The clients:

1. Both Clients Connect to the server:

```python
connect("ws://localhost:4443")
```

2. Both Listen for incoming data:

```python
async for message in websocket:
```

3. One client acts as a frontend dashboard, it decodes each packet, verifies the CRC code of each packet, and plots the necessary data points on different graph, while the other client decodes, verifies and stores the data asynchronously via asyncpg into a postgres database

---

# 📦 Telemetry Data Structure

Each packet contains:

```tuple
( 
  "header": char,
  "packet_id": uint32,
  "timestamp":uint32
  "altitude": int16,
  "pressure": uint16,
  "humidity": uint8,
  "temperature": int16,
  "voltage": uint16,
  "acceleration": [x, y, z] int16 per axis,
  "GPS Lattitude": int32,
  "GPS Longitude": int32,
  "Gyro": [x, y, z], int16 per axis,
  "timestamp": uint32,
  "Luminous Intensity": uint,
  "current": uint16,
  "CRC": uint16
)
```

---

# ⏱️ Sampling Rate

```python
sampling rate has a maximum of 10Hz, due to limitations of the ground station computer
```

* ~10 samples per second (10 Hz)
* Suitable for real-time telemetry data visualization and storage

---

# 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### 2. Install python dependencies

```bash
pip install -r rquirements.txt
```

---

# ▶️ Usage

## Start the Server

```bash
python server.py
```

Output:

```
asynchronous server running on port 4443, data from server streams asynchronously to both client programs
```

---

## Start the Client (in another terminal)

```bash
python client.py
```

Output:

```
Client1 displays data via graphs on dashboard while client2 stores the data in a postgrs db
```
---
# 🚀 Future Improvements

* Replace simulated data with **real sensor input**

# 🧪 Educational Value

This project demonstrates:

* Asynchronous programming (`asyncio`)
* Real-time streaming systems
* Telemetry protocol design basics
* Client-server architecture

---

# 👨‍💻 Author

SpaceClubs -Lagos State University
* Embedded Systems
* Space Systems (CanSat, CubeSat)
* Real-time Data Engineering

---

# 📜 License

This project is open-source and available for educational use.



