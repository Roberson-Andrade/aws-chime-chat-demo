#!/usr/bin/env bash
set -e

APP_INSTANCE_ARN=""
APP_INSTANCE_NAME="aws-chime-demo"


echo -e "Start chime infrastructure destruction... \n"

APP_INSTANCE_ARN=$(aws chime list-app-instances --query "AppInstances[*].{ name:Name, appInstanceArn:AppInstanceArn }[?name=='$APP_INSTANCE_NAME'].appInstanceArn" --output text)

aws chime delete-app-instance \
  --app-instance-arn $APP_INSTANCE_ARN \
  --region us-east-1 \
	--output text >/dev/null
 
echo -e "Chime done! \n"

echo -e "Start terraform infrastructure destruction... \n"

cd ../terraform
terraform destroy

