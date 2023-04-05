data "aws_iam_policy_document" "authenticated_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values   = [aws_cognito_identity_pool.main.id]
    }

    condition {
      test     = "ForAnyValue:StringLike"
      variable = "cognito-identity.amazonaws.com:amr"
      values   = ["authenticated"]
    }
  }
}

resource "aws_iam_role" "authenticated" {
  name               = "cognito-authenticated"
  assume_role_policy = data.aws_iam_policy_document.authenticated_trust_policy.json
}

data "aws_iam_policy_document" "default_policy_for_lambda" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "create_chat_user_lambda" {
  name               = "create_chat_user_lambda"
  assume_role_policy = data.aws_iam_policy_document.default_policy_for_lambda.json
}
