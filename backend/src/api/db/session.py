import os
import sqlmodel
import timescaledb
from timescaledb import create_engine
from sqlmodel import SQLModel, Session


DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise NotImplementedError("DATABASE_URL needs to be set")

# Render gives postgres:// but psycopg v3 needs postgresql+psycopg://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(DATABASE_URL, timezone="UTC")


def init_db():
    # create database times
    # print("creating db")
    SQLModel.metadata.create_all(engine)
    timescaledb.metadata.create_all(engine)



def get_session():
    # use within routes or api endpoints
    with Session(engine) as session:
        yield session