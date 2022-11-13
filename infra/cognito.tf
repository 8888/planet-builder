module "cognito-user-pool" {
  source         = "lgallard/cognito-user-pool/aws"
  version        = "0.20.0"
  user_pool_name = "planet-builder-pool"
  domain         = "planetbuilder"
  clients = [{
    callback_urls                = ["https://www.planetbuilder.apphosting.link"]
    name                         = "default"
    supported_identity_providers = ["COGNITO"]
    allowed_oauth_flows          = ["code"]
    allowed_oauth_scopes         = ["openid", "email"]
  }]
}