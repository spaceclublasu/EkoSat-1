#!/usr/bin/env python

"""Client using the asyncio API."""
"""interval = float(input(" specify data transmission interval e.g 1.02 means 1.02Hz "))
max_altitude = float(input("specify maximum altitude e.g 1000 means 1km"))
speed  = float(input("specify ascent speed"))
"""
import asyncpg
import struct
from asyncio import Queue
from websockets.asyncio.client import connect

Decode_queue = Queue()
async def data_receiver():
    try async with connect("ws://localhost:4443") as websocket:
        #message = await websocket.recv()
       # await websocket.send(json.dumps([interval, max_altitude, speed]))
        async for message in websocket:
            decoded = struct.unpack("< I i i i h H B H h h h h h h H H ", message)
            print(decoded)
        Decode_queue.put_nowait(decoded)
    except asyncio.CancelledError:
        print("Data receiver stopped")
    except Exception as e:
        print(f"This exception occured: {e}")


async def database_writer(conn):
    print("starting database saver")
    insert_query =
async def main():
    conn = await asyncpg.connect('postgresql://postgres@localhost/Cansat')
    await conn.execute(''' CREATE TABLE IF NOT EXISTS TELEMETRY(TIMESTAMP INT NOT NULL,HUMIDITY INT NOT NULL, GPS_LATTITUDE INT NOT NULL, GPS_LONGITUDE INT NOT NULL, ALTITUDE INT NOT NULL, TEMPERATURE INT NOT NULL,PRESSURE INT NOT NULL, HUMIDITY INT NOT NULL, LUMINOUS_INTENSITY INT NOT NULL,ACCELERATION_X INT NOT NULL, ACCELERATION_Y INT NOT NULL, ACCELERATION_Z INT NOT NULL,GYRO_X INT NOT NULL, GYRO_Y INT NOT NULL, GYRO_Z INT NOT NULL, VOLTAGE INT NOT NULL, CURRENT INT NOT NULL''')
try:
    asyncio.run(get_data())
except KeyboardInterrupt:
    print("\n connection closed\n")

