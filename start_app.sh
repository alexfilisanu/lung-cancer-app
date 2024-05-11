#!/bin/bash

echo "Starting Flask servers..."
python3 auth/auth.py &
auth_pid=$!

python3 email/app.py &
email_pid=$!

python3 history/history.py &
history_pid=$!

python3 models/lung_cancer_prediction.py &
lung_cancer_prediction_pid=$!

# Start Angular frontend server
cd lung-cancer-detector-app
echo "Starting Angular frontend server..."
ng serve --open &

# Wait for user to exit
echo "Servers started. Press Ctrl+C to exit."
wait
