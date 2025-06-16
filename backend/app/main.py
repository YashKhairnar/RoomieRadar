from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .db.db import db
from .routes import synthetic, notes, roommates, chat
from .utils.logger import LogMiddleware
from .db.models import User
from .utils.session_manager import session_manager
# from db.db import db
# from routes import synthetic, notes, roommates, chat
# from utils.logger import LogMiddleware
# from utils.session_manager import session_manager

session = session_manager.get_session()
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.create_database()
    db.populate_database() # Consistent seed for synthetic data — can add this as a parameter
    yield
    # Shutdown
    session_manager.clear_session(session)
    db.reset_database()

app = FastAPI(title="Roomate Finder Fast API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach logging middleware
app.middleware("http")(LogMiddleware())

# Routers
app.include_router(synthetic.router, prefix="/_synthetic", tags=["synthetic"])
app.include_router(notes.router, prefix="/api", tags=["notes"])
app.include_router(roommates.router, prefix="/api",tags=["roommates"])
app.include_router(chat.router, prefix="/api", tags=['chat'])

@app.get("/")
def read_root():
    return {"message": "RoomieRadar Backend is running."}