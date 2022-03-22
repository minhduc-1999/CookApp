#!/bin/bash

heroku create tastify-be --remote tastify-be

source CookApp-BE/.staging.env

heroku config:set -a tastify-be MONGO_DATABASE=$MONGO_DATABASE
heroku config:set -a tastify-be CONNECTION_STRING="$CONNECTION_STRING"
heroku config:set -a tastify-be JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY
heroku config:set -a tastify-be JWT_EXPIRES_IN=$JWT_EXPIRES_IN
heroku config:set -a tastify-be GOOGLE_USER_INFO_URL=$GOOGLE_USER_INFO_URL
heroku config:set -a tastify-be GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
heroku config:set -a tastify-be GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
heroku config:set -a tastify-be PORT=$PORT
heroku config:set -a tastify-be APP_ENV=$APP_ENV
heroku config:set -a tastify-be SENTRY_URL=$SENTRY_URL
heroku config:set -a tastify-be TZ=$TZ
heroku config:set -a tastify-be LIMIT=$LIMIT
heroku config:set -a tastify-be OFFSET=$OFFSET
heroku config:set -a tastify-be TRANSPORT_HOST=$TRANSPORT_HOST
heroku config:set -a tastify-be TRANSPORT_PORT=$TRANSPORT_PORT
heroku config:set -a tastify-be DEFAULT_FROM="$DEFAULT_FROM"
heroku config:set -a tastify-be EMAIL_DOMAIN=$EMAIL_DOMAIN
heroku config:set -a tastify-be EMAIL_USER=$EMAIL_USER
heroku config:set -a tastify-be EMAIL_PASSWORD=$EMAIL_PASSWORD
heroku config:set -a tastify-be EMAIL_VERIFICATION_SECRET=$EMAIL_VERIFICATION_SECRET
heroku config:set -a tastify-be EMAIL_VERIFICATION_CALLBACK=$EMAIL_VERIFICATION_CALLBACK
heroku config:set -a tastify-be EMAIL_VERIFICATION_CALLBACK_EXPIRATION=$EMAIL_VERIFICATION_CALLBACK_EXPIRATION
heroku config:set -a tastify-be CREDENTIAL_PATH=$CREDENTIAL_PATH
heroku config:set -a tastify-be CREDENTIAL_JSON="$CREDENTIAL_JSON"
heroku config:set -a tastify-be STORAGE_BUCKET=$STORAGE_BUCKET
heroku config:set -a tastify-be PRESIGNED_LINK_EXPIRATION=$PRESIGNED_LINK_EXPIRATION
heroku config:set -a tastify-be MAX_IMAGES_PER_REQ=$MAX_IMAGES_PER_REQ
heroku config:set -a tastify-be PUBLIC_URL=$PUBLIC_URL
heroku config:set -a tastify-be STAGING_URL=$STAGING_URL
heroku config:set -a tastify-be ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID
heroku config:set -a tastify-be ONESIGNAL_REST_API_KEY=$ONESIGNAL_REST_API_KEY
heroku config:set -a tastify-be ONESIGNAL_API_BASE_URL=$ONESIGNAL_API_BASE_URL
heroku config:set -a tastify-be NEO4J_SCHEME=$NEO4J_SCHEME
heroku config:set -a tastify-be NEO4J_HOST=$NEO4J_HOST
heroku config:set -a tastify-be NEO4J_PORT=$NEO4J_PORT
heroku config:set -a tastify-be NEO4J_USERNAME=$NEO4J_USERNAME
heroku config:set -a tastify-be NEO4J_PASSWORD=$NEO4J_PASSWORD
heroku config:set -a tastify-be NEO4J_DATABASE=$NEO4J_DATABASE

heroku buildpacks:add -a tastify-be heroku/nodejs
