const hostedAngularAppUrl = 'https://www.planetbuilder.apphosting.link/';
const cognitoUrl = 'https://planetbuilder.auth.us-east-1.amazoncognito.com/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = 'fo65f9mfsft0phc90kuefck1p';
const userPoolClientRedirectUri = hostedAngularAppUrl;
const loginUrl = `${cognitoUrl}login?client_id=${userPoolClientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(userPoolClientRedirectUri)}`;
const apiUrl = 'https://dremalvl71.execute-api.us-east-1.amazonaws.com';

export const environment = {
  production: true,
  cognitoAuthUrl,
  userPoolClientId,
  userPoolClientRedirectUri,
  loginUrl,
  apiUrl,
};
