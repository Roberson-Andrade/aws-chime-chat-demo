data "archive_file" "create_chat_user_zip" {
  type        = "zip"
  source_file = "../apps/backend/lambdas/createChatUser/dist/index.js"
  output_path = "../apps/backend/lambdas/__zip__/createChatUser.zip"
}

resource "aws_lambda_function" "create_chat_user" {
  function_name    = "createChatUser"
  filename         = data.archive_file.create_chat_user_zip.output_path
  source_code_hash = data.archive_file.create_chat_user_zip.output_base64sha256
  role             = aws_iam_role.create_chat_user_lambda.arn
  handler          = "index.handler"


  runtime = "nodejs18.x"

  environment {
    variables = {
      app_instance_arn = var.app_instance_arn
    }
  }
}

resource "aws_lambda_permission" "on_cognito_signup" {
  statement_id  = "AllowExecutionFromCognitoUserPool"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_chat_user.arn
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${var.region}:${data.aws_caller_identity.current.account_id}:userpool/${aws_cognito_user_pool.main.id}"
}
