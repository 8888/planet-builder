Terraform IaC for a full-stack web app

## URLs

### [planetbuilder.apphosting.link](https://www.planetbuilder.apphosting.link/)
### [Cognito sign-in URL - Prod](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fwww.planetbuilder.apphosting.link%2F)
### [Cognito sign-in URL - Local](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F)

## API route
GET https://3cdlo8gk90.execute-api.us-east-1.amazonaws.com/planets  
Example:
```
curl -H "Authorization: id_token" https://3cdlo8gk90.execute-api.us-east-1.amazonaws.com/planets
```
id_token is the JWT returned from cognito when logging in

## Functionality
- ✅ SPA hosted in S3 and served through CloudFront
- ✅ Cognito user management
- CodePipeline to build and deploy Angular app
- ✅ Lambda with an API gateway
- Codepipeline to deploy Lambda
- ✅ Aurora PSQL RDS instance

## Documentaiton for Terraform modules used
- [s3-static-website](https://registry.terraform.io/modules/cn-terraform/s3-static-website/aws/latest)
  - Only manual step was adding the bundle to S3 through the console. This should be automated by a pipeline later.
- [cognito-user-pool](https://registry.terraform.io/modules/lgallard/cognito-user-pool/aws/latest)
  - [AWS Cognito API docs](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPoolClient.html) were useful for determining the values for the fields
  - Manually provisioned a user through the cognito console
- [lambda](https://registry.terraform.io/modules/terraform-aws-modules/lambda/aws/latest)
- [apigateway-v2](https://registry.terraform.io/modules/terraform-aws-modules/apigateway-v2/aws/latest)
- [rds-aurora](https://registry.terraform.io/modules/terraform-aws-modules/rds-aurora/aws/latest)
  - Login credentials were randomly generated and are in the terraform state. I manually added these to secretsmanager by accessing query editor for the first time.
  - The ARN for these are needed and was added to variables.tf manually
- [vpc](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)
- [secretsmanager_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret)

## DB setup
Using the simplest schema possible to just validate connectivity.
```sql
create table planet (
  id serial PRIMARY KEY,
  name text NOT NULL,
  icon_url text NOT NULL
);
```
Seeded some sample data
