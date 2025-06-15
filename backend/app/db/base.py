from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base() 

# this is the base class for all the ORM models in the application
# The Data Flow:
# Request comes in → Pydantic validates the data
# Endpoint receives validated data → Calls CRUD function
# CRUD function → Uses SQLAlchemy to query database
# Database returns data → ORM converts to Python objects
# Response sent back → Pydantic serializes for JSON