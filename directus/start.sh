#!/usr/bin/env bash

trap "exit" INT TERM ERR
trap "kill 0" EXIT

# Get the port number from the first argument
port=${1:-8055}

# Define the database and log paths
dbPath="./db/${port}.db"
logPath="./logs/${port}.log"

# Copy the database file from the template
rm -f "$dbPath"
rm -f "$logPath"
cp ./db/base.db "$dbPath"

# Start the server
export PORT="${port}"
export PUBLIC_URL="http://127.0.0.1:${port}/"
export DB_FILENAME="${dbPath}"

npm start | tee "$logPath"
