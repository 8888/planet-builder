module "lambda" {
  source        = "terraform-aws-modules/lambda/aws"
  version       = "4.7.1"
  function_name = "planets"
  description   = "Planets for planet builder"
  handler       = "planets.main"
  runtime       = "nodejs16.x"
  source_path   = "../api/"
  publish       = true
  timeout       = 5

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.apigateway-v2.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    CLUSTER_ARN = module.rds-aurora.cluster_arn
    SECRET_ARN  = module.secrets-manager.secret_arns.planet-builder-rds
    DB_NAME     = module.rds-aurora.cluster_database_name
  }
}

module "apigateway-v2" {
  source                 = "terraform-aws-modules/apigateway-v2/aws"
  version                = "2.2.1"
  name                   = "planet-builder"
  description            = "API gateway for Planet Builder lambda"
  create_api_domain_name = false

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  integrations = {
    "GET /planets" = {
      lambda_arn         = module.lambda.lambda_function_arn
      authorization_type = "JWT"
      authorizer_id      = module.apigateway-v2.apigatewayv2_authorizer_id.cognito
    }
  }

  authorizers = {
    "cognito" = {
      authorizer_type  = "JWT"
      identity_sources = "$request.header.Authorization"
      name             = "cognito"

      audience = module.cognito-user-pool.client_ids
      issuer   = "https://${module.cognito-user-pool.endpoint}"
    }
  }
}

data "aws_iam_policy_document" "query_db" {
  statement {
    actions   = ["rds-data:ExecuteStatement"]
    resources = [module.rds-aurora.cluster_arn]
    effect    = "Allow"
  }
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [module.secrets-manager.secret_arns.planet-builder-rds]
    effect    = "Allow"
  }
}

resource "aws_iam_policy" "query_db" {
  name        = "execute-db-statements"
  description = "Allow planet builder lambda to query RDS"
  policy      = data.aws_iam_policy_document.query_db.json
}

resource "aws_iam_role_policy_attachment" "attachment" {
  role       = module.lambda.lambda_role_name
  policy_arn = aws_iam_policy.query_db.arn
}
