#!/usr/bin/env python

"""Client using the asyncio API."""
"""interval = float(input(" specify data transmission interval e.g 1.02 means 1.02Hz "))
max_altitude = float(input("specify maximum altitude e.g 1000 means 1km"))
speed  = float(input("specify ascent speed"))
"""
import asyncpg
import struct
import asyncio
from websockets.asyncio.client import connect
async def data_receiver():
    async with connect("ws://localhost:4443") as websocket:
        #message = await websocket.recv()
       # await websocket.send(json.dumps([interval, max_altitude, speed]))
        async for message in websocket:
            decoded = struct.unpack("< I i i i h H B H h h h h h h H H ", message)
            print(decoded)


async def main():
    conn = await asyncpg.connect('postgresql://postgres@localhost/test')
    await conn.execute(''' CREATE TABLE IF NOT EXISTS TELEMETRY(TIMESTAMP INT NOT NULL,HUMIDITY INT NOT NULL, GPS_LATTITUDE INT NOT NULL, GPS_LONGITUDE INT NOT NULL, ALTITUDE INT NOT NULL, TEMPERATURE INT NOT NULL,PRESSURE INT NOT NULL, HUMIDITY INT NOT NULL, LUMINOUS_INTENSITY INT NOT NULL,ACCELERATION_X INT NOT NULL, ACCELERATION_Y INT NOT NULL, ACCELERATION_Z INT NOT NULL,GYRO_X INT NOT NULL, GYRO_Y INT NOT NULL, GYRO_Z INT NOT NULL, VOLTAGE INT NOT NULL, CURRENT INT NOT NULL''')
try:
    asyncio.run(get_data())
except KeyboardInterrupt:
    print("\n connection closed\n")

