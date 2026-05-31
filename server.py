"this is a cansat telemetry simulation program designed to simulate how a cansat sends data, to the g  station for visualization and storage. It is used to unders\tand how to visualize and store data properly"

import time, math, binascii
import asyncio
import websockets
import datetime
from struct import pack
from random import randint as aligned

""" i created 
1. an empty variable called telemetry which is a collections/set datatype. it is used to store the environmental variables and values,  
2. a variable called port which stores the port number where data will be transmitted from
3. a variable called interval which represensts the time interval between integer which represents the sccess
"""
CLIENTS = set()
PORT  = 4443
count = 0
print("for good results, provide high  frequency values but low ascent/descent speed values")
telemetry= {"altitude": 0, "timestamp": int(time.strftime("%H%M%S")+"00")}
frequency = float(input(" specify data transmission frequency e.g 1.02 means 1.02hz "))
interval = float(1/frequency)
max_altitude = int(input("specify maximum altitude e.g 1000 means 1km"))
asc_speed  = float(input("specify ascent speed e.g 5 means 5m/s"))#ascent speed
asc_alt_per_cycle = int(float(asc_speed/frequency) * 1000)#ascending mode altitude per cycle
desc_speed  = -float(input("specify descent speed e.g 5 means 5m/s"))#descent speed
desc_alt_per_cycle = int(float(desc_speed/frequency) * 1000)#descending mode altitude per cycle

""" i created a synchronous data streaming function to broadcast data telemetry data from from the server"""

def sensor_simulators(height_per_cycle, interval, x):
    telemetry["header"]= b'0xAA'
    telemetry["packet_id"] = x
    telemetry["pressure"] = aligned(0,65535 )
    telemetry["humidity"] = aligned(0,255)  
    telemetry["temperature"] = aligned(-255, 255)
    telemetry["altitude"] += height_per_cycle #max height is 1km aka 1000
    telemetry["voltage"] = aligned(0, 5000)
    telemetry["acceleration"] = [aligned(-32000, 32000), aligned(-32000, 32000), aligned(-32000, 32000)]
    telemetry["gps lattitude"] = aligned(-2000000000, 2000000000)
    telemetry["gps longitude"] = aligned(-2000000000, 2000000000)
    telemetry["gyro"] = [aligned(-32000, 32000), aligned(-32000, 32000), aligned(-32000, 32000)]
    telemetry["timestamp"] += int(str(interval)[2:]) if str(interval)[:2] == "0." else int(float(str(interval))*100)
    telemetry["lux"] =aligned(0, 999)
    telemetry["current"] =aligned(0, 9999)
    return telemetry

asc_tele_list =[sensor_simulators(asc_alt_per_cycle, interval, packet_id).copy() for packet_id in range(0, int(max_altitude*1000)) if telemetry["altitude"]/1000 < max_altitude]#ascent mode
desc_tele_list =[sensor_simulators(desc_alt_per_cycle, interval, packet_id).copy() for packet_id in range(0, int(max_altitude*1000)) if telemetry["altitude"]/1000 > 1]#descent mode
tele_data = asc_tele_list + desc_tele_list
print(asc_tele_list)
bin_data_list =[pack("<H", binascii.crc_hqx(x, 0)) + x for x in [ pack("<2s I I i i h h H B H h h h h h h H H ",telemetry["header"], telemetry["packet_id"], telemetry["timestamp"],telemetry["gps lattitude"],telemetry["gps longitude"], int(telemetry["altitude"]/1000), telemetry["temperature"],telemetry["pressure"], telemetry["humidity"],telemetry["lux"], telemetry["acceleration"][0], telemetry["acceleration"][1],telemetry["acceleration"][2], telemetry["gyro"][0],telemetry["gyro"][1], telemetry["gyro"][2], telemetry["voltage"],telemetry["current"]) for telemetry in tele_data]]

#final_asc_data_list = pack("<H", crc_val) + partial_asc_bin_data_list
"""
Note:
    I=> unsigned 32 bit integer
    H=> unsigned 16 bit integer
    B=> unsigned Unsigned 8 bit integer 
    the small letters correspond to the signed integer variants of the capital letters,
    eg h = signed 16 bit integer
    also, most of the print() functions are for debugging
"""


async def relay(queue, websocket):
    try:
        while True:
            message = await queue.get()
            print(message, "relay")
            await websocket.send(message)
    except asyncio.CancelledError:
        pass

async def stream_data(websocket):
    queue = asyncio.Queue(maxsize = 500)
    print("stream data 1")
    relay_task = asyncio.create_task(relay(queue, websocket))
    print("sd2")
    CLIENTS.add(queue)
    try:
        print("sd3")
        await websocket.wait_closed()
    finally:
        print("sd4")
        CLIENTS.remove(queue)
        relay_task.cancel()
        try:
            print("sd5")
            await relay_task
        except asyncio.CancelledError:
            pass

async def broadcast_packet(packet: bytes):
    """send one telemetry packet to all clients"""
    for queue in CLIENTS:
        print("sd6",queue)
        queue.put_nowait(packet)

async def telemetry_stream(bin_data_list):
    for packet in bin_data_list:
        print("ts1")
        await broadcast_packet(packet)
        print("ts2")
        await asyncio.sleep(interval)
"""i created the asynchronous main function to start the asynchronous web server and end it """
async def main():
    print("start server")
    await asyncio.sleep(10)
    async with websockets.serve(stream_data, "0.0.0.0", 4443) as server:
        print("asynchronous server running on port", PORT)


        await telemetry_stream(bin_data_list)
        print(32)
        await server.serve_forever()
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt or websockets.exceptions.ConnectionClosedOk:
        print("Client disconnected")

