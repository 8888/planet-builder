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
  try {
    const method = event.httpMethod;

    if (method === 'GET') {
      return {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify(MOCK_DATA),
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
