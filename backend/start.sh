#!/bin/bash
set -e
export PYTHONPATH=/opt/render/project/src/backend/src
cd src
exec uvicorn main:app --host 0.0.0.0 --port $PORT
