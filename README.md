Terraform IaC for a full-stack web app

## [planetbuilder.apphosting.link](https://www.planetbuilder.apphosting.link/)
## [Cognito sign-in URL - Prod](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fwww.planetbuilder.apphosting.link%2F)
## [Cognito sign-in URL - Local](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F)

## Functionality
- ✅ SPA hosted in S3 and served through CloudFront
- ✅ Cognito user management
- CodePipeline to build and deploy Angular app
- Lambda with an API gateway
- Codepipeline to deploy Lambda
- Aurora PSQL RDS instance

## Documentaiton for Terraform modules used
- [s3-static-website](https://registry.terraform.io/modules/cn-terraform/s3-static-website/aws/latest)
  - Only manual step was adding the bundle to S3 through the console. This should be automated by a pipeline later.
- [cognito-user-pool](https://registry.terraform.io/modules/lgallard/cognito-user-pool/aws/latest)
  - [AWS Cognito API docs](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPoolClient.html) were useful for determining the values for the fields
  - Manually provisioned a user through the cognito console
- [lambda](https://registry.terraform.io/modules/terraform-aws-modules/lambda/aws/latest)
- [apigateway-v2](https://registry.terraform.io/modules/terraform-aws-modules/apigateway-v2/aws/latest)
