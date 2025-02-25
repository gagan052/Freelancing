from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import asyncio
import base64
import numpy as np
import cv2
import os
from typing import Dict
from services.gesture_recognition import GestureRecognizer
from services.code_generator import CodeGenerator

# Configure logging and load environment variables
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Initialize services
gesture_recognizer = GestureRecognizer()
code_generator = CodeGenerator(os.getenv('OPENAI_API_KEY'))

# Store active connections
active_connections: Dict[str, WebSocket] = {}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Server is running"}

@app.websocket("/ws/sign-language/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    try:
        await websocket.accept()
        active_connections[user_id] = websocket
        logger.info(f"WebSocket connection accepted for {user_id}")
        
        # Send initial success message
        await websocket.send_json({
            "status": "connected",
            "message": "Connected successfully"
        })
        
        # Keep track of continuous recognition state
        is_recognizing = False
        
        while True:
            try:
                # Wait for client message
                data = await websocket.receive_json()
                logger.debug(f"Received message from {user_id}")
                
                if data.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                    continue
                
                if data.get("type") == "start_recognition":
                    is_recognizing = True
                    await websocket.send_json({
                        "status": "success",
                        "message": "Recognition started"
                    })
                    continue
                    
                if data.get("type") == "stop_recognition":
                    is_recognizing = False
                    await websocket.send_json({
                        "status": "success",
                        "message": "Recognition stopped"
                    })
                    continue
                
                if data.get("frame") and is_recognizing:
                    # Decode base64 frame
                    frame_data = base64.b64decode(data["frame"].split(',')[1])
                    frame_arr = np.frombuffer(frame_data, np.uint8)
                    frame = cv2.imdecode(frame_arr, cv2.IMREAD_COLOR)
                    
                    # Process frame
                    result = gesture_recognizer.process_frame(frame)
                    
                    # Only send meaningful updates
                    if result['status'] == 'success' and result['gesture_name'] != 'NO_GESTURE':
                        # Generate code if needed
                        code_result = await code_generator.generate_code(
                            result['gesture_sequence'],
                            language=data.get("language", "javascript")
                        )
                        result.update(code_result)
                        
                        # Send result
                        await websocket.send_json(result)
                
            except WebSocketDisconnect:
                logger.info(f"Client {user_id} disconnected")
                break
            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                await websocket.send_json({
                    "status": "error",
                    "message": f"Failed to process message: {str(e)}"
                })
                
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        active_connections.pop(user_id, None)
        try:
            await websocket.close()
        except:
            pass

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 