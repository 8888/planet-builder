// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const hostedAngularAppUrl = 'http://localhost:4200/';
const cognitoUrl = 'https://planetbuilder.auth.us-east-1.amazoncognito.com/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = 'fo65f9mfsft0phc90kuefck1p';
const userPoolClientRedirectUri = hostedAngularAppUrl;
const loginUrl = `${cognitoUrl}login?client_id=${userPoolClientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(userPoolClientRedirectUri)}`;
const apiUrl = 'https://dremalvl71.execute-api.us-east-1.amazonaws.com';

export const environment = {
  production: false,
  cognitoAuthUrl,
  userPoolClientId,
  userPoolClientRedirectUri,
  loginUrl,
  apiUrl,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
