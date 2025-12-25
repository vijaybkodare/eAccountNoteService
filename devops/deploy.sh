#!/bin/bash
COLOR_RED="\033[31m"
COLOR_GREEN="\033[32m"
COLOR_BLUE="\033[34m"
COLOR_END="\033[0m"


APP_NAME="wcpf.vikani.in"
BUILD_DIR="./publish"             
SERVER_USER="root"
SERVER_HOST="82.112.238.205"

set -e

echo -e "$COLOR_RED Starting deployment $COLOR_END"

REMOTE_PATH="/var/www/$APP_NAME"   

echo -e "$COLOR_GREEN 1. Build started. $COLOR_END"
dotnet publish -c Release -o $BUILD_DIR
echo -e "$COLOR_BLUE Build completed successfully. $COLOR_END"

echo -e "$COLOR_GREEN 2. Stop remote App. $COLOR_END"
SSH_COMMAND="sudo systemctl stop $APP_NAME.service"
ssh "$SERVER_USER@$SERVER_HOST" "$SSH_COMMAND"
echo -e "$COLOR_BLUE App stop successfully. $COLOR_END"

echo -e "$COLOR_GREEN 3. Copying build to remote. $COLOR_END"
scp -r $BUILD_DIR/* $SERVER_USER@$SERVER_HOST:$REMOTE_PATH
echo -e "$COLOR_BLUE Build copied successfully. $COLOR_END"

echo -e "$COLOR_GREEN 4. Start remote App. $COLOR_END"
SSH_COMMAND="sudo systemctl start $APP_NAME.service"
ssh "$SERVER_USER@$SERVER_HOST" "$SSH_COMMAND"
echo -e "$COLOR_BLUE App start successfully. $COLOR_END"

echo -e "$COLOR_RED Deployment end $COLOR_END"