
# coding: utf-8

# In[ ]:


import asyncio
import websockets
import json
# import nest_asyncio

# nest_asyncio.apply()

room = 1
ws_url = "wss://bebcak5d22.execute-api.us-west-1.amazonaws.com/dev"

async def hello():
    async with websockets.connect(ws_url) as websocket:
        msg = { "action": "sendmessage_route", "message": "Hello world!" }
        await websocket.send(json.dumps(msg))
        while True:
            in_msg = await websocket.recv()
            print(in_msg)
            
asyncio.get_event_loop().run_until_complete(hello())

