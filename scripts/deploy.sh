#!/usr/bin/env bash
set -e

pnpm --filter @lambda/createChatUser build

cd terraform

terraform init

terraform apply -var="app_instance_arn=$(sh ../scripts/chime.sh)"

terraform output -json > ../apps/web/src/awsconfig.json