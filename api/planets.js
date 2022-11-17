const client = require('data-api-client');

const resourceArn = process.env.CLUSTER_ARN;
const secretArn = process.env.SECRET_ARN;
const database = process.env.DB_NAME;

exports.main = async function(event, context) {
  const db = client({ database, secretArn, resourceArn });

  try {
    const method = event.httpMethod;
    console.log(`HTTP Method: ${method}`);

    if (method === 'GET') {
      const { records } = await db.query('SELECT * FROM planet;');
      console.log(records);

      return {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify(records),
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
