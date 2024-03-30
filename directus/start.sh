#!/usr/bin/env bash

# Get the port number from the first argument
port=${1:-8055}

# Define the database path
dbPath="./db/${port}.db"

# Copy the database file from the template
#rm -f $dbPath
#cp ./db/base.db $dbPath

# Start the server
export PORT="${port}"
export PUBLIC_URL="http://localhost:${port}/"
export DB_FILENAME="${dbPath}"
npm start
