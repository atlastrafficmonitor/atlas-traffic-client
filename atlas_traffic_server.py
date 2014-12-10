import asyncio
import signal
import sys
import time
import websockets
from IPython import embed

@asyncio.coroutine
def handler(websocket, path):
    while True:
        if not websocket.open:
            break

        yield from websocket.send("Hello!")
        yield from asyncio.sleep(1.0)

def boot_server(host, port):
    print('Atlas server is listening on http://', host, ':', port, sep='')

    return websockets.serve(handler, host, port)

def main():
    server = boot_server('0.0.0.0', 8765)
    event_loop = asyncio.get_event_loop()

    try:
        event_loop.run_until_complete(server)
        event_loop.run_forever()
    except KeyboardInterrupt:
        print('\nCtrl-C (SIGINT) caught. Exiting...')
    finally:
        server.close()
        event_loop.close()

if __name__ == "__main__":
    main()
