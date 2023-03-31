data "aws_iam_policy_document" "authenticated" {
  statement {
    actions = [
      "chime:Connect",
      "chime:SendChannelMessage",
      "chime:ListChannelMessages",
      "chime:CreateChannelBan",
      "chime:RedactChannelMessage",
      "chime:UpdateChannelMessage"
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
