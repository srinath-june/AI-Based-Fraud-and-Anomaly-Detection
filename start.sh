#!/bin/bash
echo "Starting AI-Based Fraud and Anomaly Detection Platform..."

(cd backend && python run.py) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
