import time
import json
import asyncio
import websockets
from random import randint as aligned

PORT = 4443
telemetry = {"altitude": 0}
history = []
clients = set()

# Runs independently — not tied to any client
async def sensor_loop():
    while telemetry["altitude"] < 999.6:
        telemetry["altitude"] = round(telemetry["altitude"] + 0.105, 3)
        telemetry["temp"] = round(aligned(2000, 3500) / 100, 2)
        telemetry["pressure"] = round(aligned(9800, 10200) / 10, 1)
        telemetry["humidity"] = round(aligned(400, 900) / 10, 1)
        telemetry["light"] = aligned(0, 999)
        telemetry["ax"] = round(aligned(-200, 200) / 100, 2)
        telemetry["ay"] = round(aligned(-200, 200) / 100, 2)
        telemetry["az"] = round(aligned(80, 120) / 100, 2)
        telemetry["gx"] = round(aligned(-500, 500) / 100, 2)
        telemetry["gy"] = round(aligned(-500, 500) / 100, 2)
        telemetry["gz"] = round(aligned(-500, 500) / 100, 2)
        telemetry["voltage"] = round(aligned(3500, 4200) / 1000, 2)
        telemetry["current"] = round(aligned(100, 500) / 1000, 2)
        telemetry["lat"] = round(6.5244 + aligned(0, 100) / 100000, 6)
        telemetry["lon"] = round(3.3792 + aligned(0, 100) / 100000, 6)
        telemetry["timestamp"] = time.strftime("%H:%M:%S.00")

        snapshot = dict(telemetry)
        history.append(snapshot)

        # Broadcast to ALL connected clients at once
        if clients:
            await asyncio.gather(
                *[client.send(json.dumps(snapshot)) for client in clients],
                return_exceptions=True
            )

        await asyncio.sleep(1)  # 1 packet per second

async def stream_data(websocket):
    # Send full history to new client first
    for packet in history:
        try:
            await websocket.send(json.dumps(packet))
        except:
            return

    # Register client to receive live broadcasts
    clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        clients.remove(websocket)

async def main():
    async with websockets.serve(
        stream_data,
        "0.0.0.0",
        4443,
        origins=None
    ) as server:
        print("asynchronous server running on port", PORT)
        await asyncio.gather(
            server.serve_forever(),
            sensor_loop(),  # runs independently
        )

try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("Server shut down")