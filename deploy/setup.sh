#!/bin/bash

heroku login

heroku create tastify-api --remote tastify-api

source CookApp-BE/.env

heroku config:set -a tastify-api MONGO_DATABASE=$MONGO_DATABASE
heroku config:set -a tastify-api CONNECTION_STRING=$CONNECTION_STRING
heroku config:set -a tastify-api JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY
heroku config:set -a tastify-api JWT_EXPIRES_IN=$JWT_EXPIRES_IN
heroku config:set -a tastify-api GOOGLE_USER_INFO_URL=$GOOGLE_USER_INFO_URL
heroku config:set -a tastify-api GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
heroku config:set -a tastify-api GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
heroku config:set -a tastify-api PORT=$PORT
heroku config:set -a tastify-api APP_ENV=$APP_ENV
heroku config:set -a tastify-api SENTRY_URL=$SENTRY_URL
heroku config:set -a tastify-api TZ=$TZ
heroku config:set -a tastify-api LIMIT=$LIMIT
heroku config:set -a tastify-api OFFSET=$OFFSET
heroku config:set -a tastify-api TRANSPORT_HOST=$TRANSPORT_HOST
heroku config:set -a tastify-api TRANSPORT_PORT=$TRANSPORT_PORT
heroku config:set -a tastify-api DEFAULT_FROM=$DEFAULT_FROM
heroku config:set -a tastify-api EMAIL_DOMAIN=$EMAIL_DOMAIN
heroku config:set -a tastify-api EMAIL_USER=$EMAIL_USER
heroku config:set -a tastify-api EMAIL_PASSWORD=$EMAIL_PASSWORD
heroku config:set -a tastify-api EMAIL_VERIFICATION_SECRET=$EMAIL_VERIFICATION_SECRET
heroku config:set -a tastify-api EMAIL_VERIFICATION_CALLBACK=$EMAIL_VERIFICATION_CALLBACK
heroku config:set -a tastify-api EMAIL_VERIFICATION_CALLBACK_EXPIRATION=$EMAIL_VERIFICATION_CALLBACK_EXPIRATION
heroku config:set -a tastify-api CREDENTIAL_PATH=$CREDENTIAL_PATH
heroku config:set -a tastify-api STORAGE_BUCKET=$STORAGE_BUCKET
heroku config:set -a tastify-api PRESIGNED_LINK_EXPIRATION=$PRESIGNED_LINK_EXPIRATION
heroku config:set -a tastify-api MAX_IMAGES_PER_REQ=$MAX_IMAGES_PER_REQ
heroku config:set -a tastify-api PUBLIC_URL=$PUBLIC_URL

heroku buildpacks:add -a tastify-api heroku-community/multi-procfile
heroku buildpacks:add -a tastify-api heroku/nodejs

heroku config:set -a tastify-api PROCFILE=CookApp-BE/Procfile
