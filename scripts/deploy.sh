#!/usr/bin/env bash
set -e

cd backend/lambdas/createChatUser

pnpm build

cd ../../../terraform

terraform apply -var="app_instance_arn=$(sh ../scripts/chime.sh)"

terraform output -json > ../web/src/awsconfig.json