
resource "aws_iam_role_policy_attachment" "authenticated" {
  role       = aws_iam_role.authenticated.name
  policy_arn = aws_iam_policy.authenticated.arn
}

resource "aws_iam_role_policy_attachment" "create_chat_user_attachment_cloudwatch_logs" {
  role       = aws_iam_role.create_chat_user_lambda.name
  policy_arn = aws_iam_policy.lambda_cloudwatch_logs.arn
}

resource "aws_iam_role_policy_attachment" "create_chat_user_attachment_invoke_lambda" {
  role       = aws_iam_role.create_chat_user_lambda.name
  policy_arn = aws_iam_policy.invoke_lambda.arn
}

resource "aws_iam_role_policy_attachment" "create_chat_user_attachment_chime_messaging" {
  role       = aws_iam_role.create_chat_user_lambda.name
  policy_arn = aws_iam_policy.chime_messaging.arn
}
