data "aws_iam_policy_document" "authenticated" {
  statement {
    actions = [
      "chime:Connect",
      "chime:SendChannelMessage",
      "chime:ListChannelMessages",
      "chime:RedactChannelMessage",
      "chime:UpdateChannelMessage",
      "chime:ListAppInstanceUsers",
      "chime:ListChannelMembershipsForAppInstanceUser"
    ]

    resources = [
      "arn:aws:chime:us-east-1:${data.aws_caller_identity.current.account_id}:app-instance/*/user/*",
      "arn:aws:chime:us-east-1:${data.aws_caller_identity.current.account_id}:app-instance/*/channel/*"
    ]
  }
  statement {
    actions = [
      "chime:GetMessagingSessionEndpoint",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "authenticated" {
  name   = "authenticated"
  policy = data.aws_iam_policy_document.authenticated.json
}
data "aws_iam_policy_document" "lambda_cloudwatch_logs" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "lambda_cloudwatch_logs" {
  name   = "lambda_cloudwatch_logs"
  policy = data.aws_iam_policy_document.lambda_cloudwatch_logs.json
}

data "aws_iam_policy_document" "invoke_lambda" {
  statement {
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction"
    ]
    resources = ["arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:create_chat_user"]
  }
}

resource "aws_iam_policy" "invoke_lambda" {
  name   = "invoke_lambda"
  policy = data.aws_iam_policy_document.invoke_lambda.json
}

data "aws_iam_policy_document" "chime_messaging" {
  statement {
    actions = [
      "chime:CreateAppInstanceUser"
    ]

    resources = [
      "arn:aws:chime:us-east-1:${data.aws_caller_identity.current.account_id}:app-instance/*/user/*",
      "arn:aws:chime:us-east-1:${data.aws_caller_identity.current.account_id}:app-instance/*/channel/*"
    ]
  }
}

resource "aws_iam_policy" "chime_messaging" {
  name   = "chime_messaging"
  policy = data.aws_iam_policy_document.chime_messaging.json
}
