#!/usr/bin/env bash

# Define the database path
dbOutputPath="./directus/db/base.db"

# Load the .env file
export $(cat .env | xargs)

# remove existing database
rm -f $DB_FILENAME
rm -f $dbOutputPath

# Start the install
npm run directus bootstrap

# Copy the database to the output path
cp $DB_FILENAME $dbOutputPath
