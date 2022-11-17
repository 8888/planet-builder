const client = require('data-api-client');

const resourceArn = process.env.CLUSTER_ARN;
const secretArn = process.env.SECRET_ARN;
const database = process.env.DB_NAME;

const MOCK_DATA = [
  {
    id: 'p1',
    name: 'Earth',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Blue_Marble_%28remastered%29.jpg',
  },
  {
    id: 'p2',
    name: 'Mars',
    iconUrl: 'https://cdn.mos.cms.futurecdn.net/rFxjRZcHNTZ8Jpw34pthnQ.jpg',
  },
];

exports.main = async function(event, context) {
  const db = client({ database, secretArn, resourceArn });

  try {
    const method = event.httpMethod;

    if (method === 'GET') {
      console.log('Querying for planets')
      const { records } = await db.query('SELECT * FROM planet;');
      console.log(records)

      return {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify([...MOCK_DATA, records]),
      };
    }
  } catch(error) {
    const body = error.stack || JSON.stringify(error);

    return {
      statusCode: 400,
      headers: {'Access-Control-Allow-Origin': '*'},
      body
    };
  }
}
