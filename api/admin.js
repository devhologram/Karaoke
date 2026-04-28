import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis = null;
if (redisUrl) {
  redis = new Redis(redisUrl);
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ error: 'Database environment variable (REDIS_URL) is missing.' });
  }

  try {
    // Get ALL items in the leaderboard (0 to -1 means everything)
    const results = await redis.zrange('leaderboard:global', 0, -1, 'WITHSCORES');
    
    let rawData = [];
    if (Array.isArray(results)) {
      for (let i = 0; i < results.length; i += 2) {
        rawData.push({
          score: parseInt(results[i + 1], 10),
          raw_json_data: results[i]
        });
      }
    }

    // Return a beautifully formatted HTML page showing the raw data
    const responseHtml = `
      <html>
        <head>
          <title>Raw Database Viewer</title>
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              background: #0b0c10; 
              color: #00ffcc; 
              padding: 2rem; 
            }
            h2 { color: #fff; }
            pre { 
              background: #1f2833; 
              padding: 1.5rem; 
              border: 1px solid rgba(255,255,255,0.2); 
              border-radius: 12px; 
              font-size: 1.1rem;
              box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            }
          </style>
        </head>
        <body>
          <h2>Raw Database Contents (leaderboard:global)</h2>
          <p>Total saved scores: ${rawData.length}</p>
          <pre>${JSON.stringify(rawData, null, 4)}</pre>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(responseHtml);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
