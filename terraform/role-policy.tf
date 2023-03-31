
resource "aws_iam_role_policy_attachment" "authenticated" {
  role       = aws_iam_role.authenticated.name
  policy_arn = aws_iam_policy.authenticated.arn
}
