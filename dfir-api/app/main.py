### backend/app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import investigations, reports, tools, standards, inventory, overview, settings,dashboard

app = FastAPI(root_path="/api")
origins = [
    "http://54.196.221.208",
    "http://ec2-54-196-221-208.compute-1.amazonaws.com",
    "http://localhost:5173",  # if using local dev frontend
    # add other allowed origins if needed
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # For production, replace "*" with your React app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(investigations.router, prefix="/investigations", tags=["Investigations"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(tools.router, prefix="/tools", tags=["Tools"])
app.include_router(standards.router, prefix="/standards", tags=["Standards"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(overview.router, prefix="/overview", tags=["Overview"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
