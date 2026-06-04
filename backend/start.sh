#!/bin/bash
set -e
export PYTHONPATH=/opt/render/project/src/backend/src
exec uvicorn src.main:app --host 0.0.0.0 --port $PORT
