#!/bin/bash
COLOR_RED="\033[31m"
COLOR_GREEN="\033[32m"
COLOR_BLUE="\033[34m"
COLOR_END="\033[0m"

COMPANY_NAME="ktesystemservice.vikani.in"
DB_NAME="KTESystem"
SERVER_USER="root"
SERVER_HOST="82.112.238.205"
REMOTE_SCRIPT_PATH="/var/opt/mssql/backups/backup_db.sh"
REMOTE_DB_BACKUP_PATH="/var/opt/mssql/backups"
LOCAL_DB_BACKUP_PATH="./db_backup"

set -e

echo -e "$COLOR_RED Starting DB Backup:$DB_NAME $COLOR_END"

echo -e "$COLOR_BLUE List of companies $COLOR_END"
echo -e "$COLOR_BLUE 1. ktesystemservice.vikani.in $COLOR_END"
echo -e "$COLOR_BLUE 2. ktesystemservice2.vikani.in $COLOR_END"
echo -e "$COLOR_BLUE Select company option.:  $COLOR_END"
read -p "" COMPANY_ID
echo -e "$COLOR_GREEN Your selected option is: $COMPANY_ID  $COLOR_END"
if [ "$COMPANY_ID" == "2" ]; then
    DB_NAME="KTESystem2"
    COMPANY_NAME="ktesystemservice2.vikani.in"
fi

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${DB_NAME}_${TIMESTAMP}"

echo -e "$COLOR_GREEN Company to process is: $APP_NAME $COLOR_END"
echo -e "$COLOR_GREEN Database Name is: $DB_NAME $COLOR_END"

echo -e "$COLOR_GREEN 1. Backup started. $COLOR_END"
SSH_COMMAND="$REMOTE_SCRIPT_PATH $DB_NAME $BACKUP_FILE"
ssh "$SERVER_USER@$SERVER_HOST" "$SSH_COMMAND"
echo -e "$COLOR_BLUE DB Backup completed successfully. $COLOR_END"

echo -e "$COLOR_GREEN 2. Copying db backup to local. $COLOR_END"
scp $SERVER_USER@$SERVER_HOST:$REMOTE_DB_BACKUP_PATH/${BACKUP_FILE}.bak $LOCAL_DB_BACKUP_PATH 
echo -e "$COLOR_BLUE DB backup copied successfully. $COLOR_END"

echo -e "$COLOR_RED DB Backup end $COLOR_END"
