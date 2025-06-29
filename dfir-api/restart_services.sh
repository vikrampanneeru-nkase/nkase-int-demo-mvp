#!/bin/bash

echo "🔄 Stopping existing Python processes..."
ps aux | grep python | grep -v grep | awk '{print $2}' | xargs -r kill -9

echo "✅ Existing Python processes killed."

echo "🚀 Starting FastAPI app..."
nohup /home/admin/nkase-int-demo-code/dfir-api/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 > fastapi.log 2>&1 &

echo "📦 Starting ARQ worker..."
nohup /home/admin/nkase-int-demo-code/dfir-api/venv/bin app.workers.mitigation_worker.WorkerSettings > arq.log 2>&1 &

echo "✅ Services restarted successfully."

