module "s3-static-website" {
  providers = {
    aws.main         = aws
    aws.acm_provider = aws
  }

  source              = "cn-terraform/s3-static-website/aws"
  version             = "1.0.1"
  name_prefix         = "planet-builder"
  website_domain_name = "planetbuilder.apphosting.link"

  website_bucket_force_destroy = true
}
