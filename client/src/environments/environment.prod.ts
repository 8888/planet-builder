const hostedAngularAppUrl = 'https://www.planetbuilder.apphosting.link/';
const cognitoUrl = 'https://planetbuilder.auth.us-east-1.amazoncognito.com/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = '7o5fj2vu3r2qti8j4iq8b57em0';
const userPoolClientRedirectUri = hostedAngularAppUrl;
const loginUrl = `${cognitoUrl}login?client_id=${userPoolClientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(userPoolClientRedirectUri)}`;

export const environment = {
  production: true,
  cognitoAuthUrl,
  userPoolClientId,
  userPoolClientRedirectUri,
  loginUrl,
};
