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

The client:

1. Connects to the server:

```python
connect("ws://localhost:4443")
```

2. Listens for incoming data:

```python
async for message in websocket:
```

3. Prints telemetry data to console

---

# 📦 Telemetry Data Structure

Each packet contains:

```json
{
  "altitude": int,
  "pressure": int,
  "humidity": int,
  "temperature": int,
  "voltage": int,
  "acceleration": [x, y, z],
  "GPS Lattitude": int,
  "GPS Longitude": int,
  "Gyro": [x, y, z],
  "timestamp": int,
  "Luminous Intensity": int,
  "current": int
}
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
asynchronous server running on port 4443
```

---

## Start the Client (in another terminal)

```bash
python client.py
```

Output:

```
{telemetry data streaming...}
```

---

# ⚠️ Known Limitations

* No persistent storage (yet)

---

# 🚀 Future Improvements

* Integrate with:
  * Database (PostgreSQL / InfluxDB)
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



