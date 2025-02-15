from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64
import json
from services.sign_language_recognition import SignLanguageRecognizer
from services.search_service import SearchService
from services.ide_service import IDEService
from services.chat_service import ChatService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services with error handling
try:
    recognizer = SignLanguageRecognizer()
    logger.info("Sign Language Recognizer initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Sign Language Recognizer: {e}")
    recognizer = None

# Initialize services
search_service = SearchService()
ide_service = IDEService()

# Initialize chat service
chat_service = ChatService()

@app.on_event("startup")
async def startup_event():
    if not recognizer:
        logger.error("Sign Language Recognizer not initialized")
        raise RuntimeError("Failed to initialize required services")

# Search endpoint
@app.get("/api/search")
async def search(query: str, category: str = "all"):
    try:
        results = search_service.search(query, category)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Code execution endpoint
@app.post("/api/execute-code")
async def execute_code(code: str, language: str):
    try:
        result = await ide_service.execute_code(code, language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket for sign language recognition
@app.websocket("/ws/sign-language")
async def websocket_endpoint(websocket: WebSocket):
    if not recognizer:
        await websocket.close(code=1011, reason="Service not available")
        return

    await websocket.accept()
    logger.info("WebSocket connection established")
    
    try:
        while True:
            try:
                data = await websocket.receive_json()
                
                frame_data = data['frame'].split(',')[1]
                language = data.get('language', 'javascript')
                
                nparr = np.frombuffer(base64.b64decode(frame_data), np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if frame is None:
                    raise ValueError("Invalid frame data")
                
                result = recognizer.process_frame(frame, language)
                
                _, buffer = cv2.imencode('.jpg', result['frame'])
                encoded_frame = base64.b64encode(buffer).decode('utf-8')
                
                await websocket.send_json({
                    'command': result['command'],
                    'confidence': result['confidence'],
                    'gesture_name': result['gesture_name'],
                    'description': result['description'],
                    'frame': f'data:image/jpeg;base64,{encoded_frame}'
                })
                
            except json.JSONDecodeError:
                logger.error("Invalid JSON received")
                await websocket.send_json({
                    'error': 'Invalid data format'
                })
                
            except Exception as e:
                logger.error(f"Frame processing error: {e}")
                await websocket.send_json({
                    'error': 'Frame processing failed'
                })
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

# Add chat endpoints
@app.websocket("/ws/chat/{user_id}")
async def chat_websocket(websocket: WebSocket, user_id: str):
    await websocket.accept()
    logger.info(f"Chat WebSocket connection established for user {user_id}")
    
    try:
        while True:
            try:
                data = await websocket.receive_json()
                message = data.get('message')
                
                if not message:
                    raise ValueError("Message is required")
                
                response = await chat_service.get_response(user_id, message)
                
                await websocket.send_json(response)
                
            except json.JSONDecodeError:
                logger.error("Invalid JSON received in chat")
                await websocket.send_json({
                    'error': 'Invalid message format'
                })
                
    except WebSocketDisconnect:
        logger.info(f"Chat client {user_id} disconnected")
    except Exception as e:
        logger.error(f"Chat WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "recognizer": recognizer is not None
        }
    } 