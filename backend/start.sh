#!/bin/bash
cd /opt/render/project/src/backend/src
exec uvicorn main:app --host 0.0.0.0 --port $PORT
