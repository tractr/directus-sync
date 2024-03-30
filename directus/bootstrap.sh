#!/usr/bin/env bash

# Define the port number from the first argument
port=8055

# Define the database path
dbPath="./db/base.db"

# Copy the database file from the template
rm -f $dbPath

# Start the server
export PORT="${port}"
export PUBLIC_URL="http://localhost:${port}/"
export DB_FILENAME="${dbPath}"
npm run bootstrap
