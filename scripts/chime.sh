#!/usr/bin/env bash
set -e

APP_INSTANCE_ARN=""
APP_INSTANCE_USER_ARN=""
APP_INSTANCE_NAME="aws-chime-demo"

APP_INSTANCE_ARN=$(aws chime list-app-instances --query "AppInstances[*].{ name:Name, appInstanceArn:AppInstanceArn }[?name=='$APP_INSTANCE_NAME'].appInstanceArn" --output text)

if [ -n "$APP_INSTANCE_ARN" ]; then
	echo "$APP_INSTANCE_ARN"
	exit
fi

APP_INSTANCE_ARN=$(aws chime create-app-instance --name "$APP_INSTANCE_NAME" --region us-east-1 --output text)

APP_INSTANCE_USER_ARN=$(aws chime create-app-instance-user \
	--app-instance-arn "$APP_INSTANCE_ARN" \
	--app-instance-user-id "application-worker" \
	--name "application-worker" \
	--region us-east-1 \
	--output text)

aws chime-sdk-identity create-app-instance-admin \
	--app-instance-arn "$APP_INSTANCE_ARN" \
	--app-instance-admin-arn "$APP_INSTANCE_USER_ARN" \
	--region us-east-1 \
	--output text >/dev/null

echo "$APP_INSTANCE_ARN"
