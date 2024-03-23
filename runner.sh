#!/bin/bash

set -e

update-ca-certificates
node -r dotenv/config ./server.js