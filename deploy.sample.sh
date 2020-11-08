#! /bin/bash

# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

yarn build
docker build -t theednaffattack/<PROJECT_NAME>:<TAG> . && docker push theednaffattack/<PROJECT_NAME>:<TAG>
ssh eddie@000.000.000.00 'cd "<SERVER_DIRECTORY_NAME>" && docker-compose pull && docker-compose up -d'
