#!/usr/bin/env python

import asyncio, sys
import struct 
from decimal import Decimal,getcontext
import asyncpg
from websockets.asyncio.client import connect

# 1. Bounded queue ensures memory never grows infinitely if DB falls behind
decode_queue = asyncio.Queue(maxsize=500)
Max_retries = 100
async def data_receiver(Retries_left):
    while True:
        print("[Receiver] Starting WebSocket listener...")
        try:
            # Fixed syntax error: 'try' must be on its own line
            async with connect("ws://localhost:4443") as websocket:
                Retries_left = Max_retries
                async for message in websocket:
                    decoded = struct.unpack("< H I I i i h h H B H h h h h h h H H H ", message)
                    # Real-time Drop Policy: If queue is full (DB is slow), 
                    # drop the oldest frame to make room for the newest telemetry.
                    print(3455,decoded[0])
                    #await get_current.close()
                    if decode_queue.full():
                        try:
                            decode_queue.get_nowait()
                            decode_queue.task_done()
                        except asyncio.QueueEmpty:
                            pass
                    # Fixed: Moved inside the loop so EVERY frame gets queued
                    decode_queue.put_nowait(decoded)
        except asyncio.CancelledError:
            print("[Receiver] Data receiver stopped safely.")
            break;
        except ConnectionRefusedError as e:
            Retries_left -= 1
            await asyncio.sleep(0.5)
            print(f"[Receiver] Exception occurred: {e}, automatic reconnection started, {Retries_left} retries left")
            if Retries_left == 0:
                try:
                    sys.exit(0)
                except SystemExit:
                    print("connection has been permanently terminated, press Ctrl+C to exit the program")
                    break;


async def database_writer(conn):
    print("[Writer] Starting database saver...")
    insert_query = """
        INSERT INTO TELEMETRY (
        PACKET_ID, TIMESTAMP, GPS_LATITUDE, GPS_LONGITUDE, ALTITUDE, 
            TEMPERATURE, PRESSURE, HUMIDITY, LUMINOUS_INTENSITY, 
            ACCELERATION_X, ACCELERATION_Y, ACCELERATION_Z, 
            GYRO_X, GYRO_Y, GYRO_Z, VOLTAGE, CURRENT
        ) VALUES ( $1,$2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
    """
    try:
        while True:
            # If queue is empty, this line pauses the task automatically (0% CPU)
            data_frame = await decode_queue.get()
            clean_db_payload = data_frame[1:18]
            getcontext().prec = 7
            scaled_payload =[data_frame[1],data_frame[2],Decimal(data_frame[3])/Decimal(1000000),Decimal(data_frame[4])/Decimal(1000000), Decimal(data_frame[5]),Decimal(data_frame[6])/Decimal(100), Decimal(data_frame[7])/Decimal(10),Decimal(data_frame[8])/Decimal(10),data_frame[9],Decimal(data_frame[10])/Decimal(100),Decimal(data_frame[11])/Decimal(100), Decimal(data_frame[12])/Decimal(100),Decimal(data_frame[13])/Decimal(100), Decimal(data_frame[14])/Decimal(100),Decimal(data_frame[15])/Decimal(100),Decimal(data_frame[16])/Decimal(1000),Decimal(data_frame[17])/Decimal(1000)]





            print(type(data_frame),data_frame,344)     
            try:
                print("data insertion into postgres db started")
                await conn.execute(insert_query, *scaled_payload)
            except Exception as db_err:
                print(f"[Writer] Database insertion failed: {db_err}")
            finally:
                decode_queue.task_done()
                await asyncio.sleep(0)
    except asyncio.CancelledError:
        print("[Writer] Database writer stoppeid safely.")
        

async def main():
    # Establish Connection
    conn = await asyncpg.create_pool(dsn= 'postgres://cansat:12345@localhost/cansat',
min_size =1,
max_size=10
                                     )
    async with conn.acquire() as conn_pool:
        await conn_pool.execute(''' 
            CREATE TABLE IF NOT EXISTS TELEMETRY (
                PACKET_ID INT NOT NULL,
                TIMESTAMP INT NOT NULL,
                GPS_LATITUDE NUMERIC NOT NULL, 
                GPS_LONGITUDE NUMERIC NOT NULL, 
                ALTITUDE NUMERIC NOT NULL, 
                TEMPERATURE NUMERIC NOT NULL,
                PRESSURE NUMERIC NOT NULL, 
                HUMIDITY NUMERIC NOT NULL, 
                LUMINOUS_INTENSITY INT NOT NULL,
                ACCELERATION_X NUMERIC NOT NULL, 
                ACCELERATION_Y NUMERIC NOT NULL, 
                ACCELERATION_Z NUMERIC NOT NULL,
                GYRO_X NUMERIC NOT NULL, 
                GYRO_Y NUMERIC NOT NULL, 
                GYRO_Z NUMERIC NOT NULL, 
                VOLTAGE NUMERIC NOT NULL, 
                CURRENT NUMERIC NOT NULL
            );
        ''')

        
    # Run both functions concurrently under the event loop
    try:
        await asyncio.gather(
        data_receiver(Max_retries),
        database_writer(conn)
        )
    except asyncio.CancelledError:
    #    group.cancel()
        print(2345)
        pass
    finally:
        print("[Main] Closing database connection...")
        print("[Main] Offline.")

if __name__ == "__main__":
    try:
        # Fixed: call main() instead of the non-existent get_data()
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nConnection closed cleanly via user interrupt.\n")
