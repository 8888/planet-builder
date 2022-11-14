module "lambda" {
  source        = "terraform-aws-modules/lambda/aws"
  version       = "4.7.1"
  function_name = "planets"
  description   = "Planets for planet builder"
  handler       = "planets.main"
  runtime       = "nodejs16.x"
  source_path   = "../api/planets.js"
}
