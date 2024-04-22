#!/usr/bin/env bash

# Define the database path
dbPath="./directus/db/base.db"

# Copy the database file from the template
rm -f $dbPath

# Load the .env file and override the db path
source ./.env
export DB_FILENAME="$dbPath"

# Start the install
npm run bootstrap
