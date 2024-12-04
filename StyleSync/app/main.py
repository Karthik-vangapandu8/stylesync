from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import uvicorn
import psutil
import json
from datetime import datetime, timedelta
import asyncio

app = FastAPI(title="StyleSync", description="Modern Server Management UI")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for JWT authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# WebSocket connections store
active_connections: list[WebSocket] = []

@app.get("/")
async def read_root():
    return {"message": "Welcome to StyleSync API"}

@app.get("/metrics")
async def get_metrics():
    """Get current system metrics"""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage('/')._asdict(),
        "network": psutil.net_io_counters()._asdict(),
        "timestamp": datetime.now().isoformat()
    }

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            metrics = {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory": psutil.virtual_memory()._asdict(),
                "disk": psutil.disk_usage('/')._asdict(),
                "network": psutil.net_io_counters()._asdict(),
                "timestamp": datetime.now().isoformat()
            }
            await websocket.send_json(metrics)
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

@app.get("/services")
async def get_services():
    """Get list of running services"""
    services = []
    for proc in psutil.process_iter(['pid', 'name', 'status', 'cpu_percent', 'memory_percent']):
        try:
            pinfo = proc.info
            services.append({
                'pid': pinfo['pid'],
                'name': pinfo['name'],
                'status': pinfo['status'],
                'cpu_percent': pinfo['cpu_percent'],
                'memory_percent': pinfo['memory_percent']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return services

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
