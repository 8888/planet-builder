module "lambda" {
  source        = "terraform-aws-modules/lambda/aws"
  version       = "4.7.1"
  function_name = "planets"
  description   = "Planets for planet builder"
  handler       = "planets.main"
  runtime       = "nodejs16.x"
  source_path   = "../api/planets.js"
  publish       = true

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.apigateway-v2.apigatewayv2_api_execution_arn}/*/*"
    }
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
      # audience is the Cognito app Client ID
      # This will be in the JWT under the aud key
      # API gateway will confirm these match
      audience = ["7o5fj2vu3r2qti8j4iq8b57em0"]
      issuer   = "https://${module.cognito-user-pool.endpoint}"
    }
  }
}
