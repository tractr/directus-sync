#!/usr/bin/env bash

# Define the port number from the first argument
port=8055

# Define the database path
dbPath="./directus/db/base.db"

# Copy the database file from the template
rm -f $dbPath

# Start the install
export PORT="${port}"
export PUBLIC_URL="http://localhost:${port}/"
export DB_FILENAME="${dbPath}"
export EXTENSIONS_PATH="./directus/extensions"
export STORAGE_LOCAL_ROOT="./directus/uploads"
export DB_CLIENT="sqlite3"
export LOG_LEVEL="debug"
export KEY="xxxxxxxxx"
export SECRET="xxxxxxxxx"
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="password"
npm run bootstrap
