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
async def get_data():
    async with connect("ws://localhost:4443") as websocket:
        #message = await websocket.recv()
       # await websocket.send(json.dumps([interval, max_altitude, speed]))
        async for message in websocket:
            print(struct.unpack("< I i i i h H B H h h h h h h H H ", message), 34)
            await asyncio.sleep(0.02)

async def main():
    conn = await asyncpg.connect('postgresql://postgres@localhost/test')
    await conn.execute(''' CREATE TABLE IF NOT EXISTS TELEMETRY(PRESSURE INT NOT NULL,HUMIDITY INT NOT NULL,TEMPERATURE INT NOT NULL
try:
    asyncio.run(get_data())
except KeyboardInterrupt:
    print("\n connection closed\n")

