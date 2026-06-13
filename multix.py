from concurrent.futures import ProcessPoolExecutor

def square():
    return 45

with ProcessPoolExecutor() as executor:
    results = executor.map(square, )

print(list(results))
