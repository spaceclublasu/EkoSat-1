import asyncio
import time

async def say_after(delay, what):
    print(what + f"is {delay}",)
    await asyncio.sleep(delay)
    print(what)

async def main():
    task1 = asyncio.create_task(
        say_after(1, 'hello'))
 
    task2 = asyncio.create_task(
        say_after(2, 'world'))

    print(f"started at {time.strftime('%X')}")

    # Wait until both tasks are completed (should take
    # around 2 seconds.)
    await asyncio.gather(say_after(1, "what"), say_after(2, "why"))


    print(f"finished at {time.strftime('%X')}")

asyncio.run(main())
