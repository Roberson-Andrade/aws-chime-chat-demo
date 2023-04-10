#!/usr/bin/env bash
set -e

APP_INSTANCE=""
USER_ARN=""
APP_INSTANCE_NAME="aws-chime-demo"

# Verify if the app instance already exists
APP_INSTANCE=$(aws chime list-app-instances --query "AppInstances[*].{ name:Name, appInstanceArn:AppInstanceArn }[?name=='$APP_INSTANCE_NAME'].appInstanceArn" --output text)

# Print the app instance if exists
if [ -n "$APP_INSTANCE" ]; then
	echo "$APP_INSTANCE"
	exit
fi

# Create an app instance
APP_INSTANCE=$(aws chime create-app-instance --name "$APP_INSTANCE_NAME" --region us-east-1 --output text)

# Create an user to be used by our application using the app instance
USER_ARN=$(aws chime create-app-instance-user --app-instance-arn "$APP_INSTANCE" --app-instance-user-id "application-worker" --name "application-worker" --region us-east-1 --output text)

# Promote the user to an admin
aws chime-sdk-identity create-app-instance-admin --app-instance-arn "$APP_INSTANCE" --app-instance-admin-arn "$USER_ARN" --region us-east-1 --output text >/dev/null

echo "$APP_INSTANCE"
