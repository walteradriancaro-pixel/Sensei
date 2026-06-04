exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Force haiku for speed — avoids Netlify 10s timeout
    body.model = 'claude-haiku-4-5-20251001';
    body.max_tokens = body.max_tokens || 1000;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': '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',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: text
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: err.message})
    };
  }
};
