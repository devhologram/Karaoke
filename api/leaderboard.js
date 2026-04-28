import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis = null;
if (redisUrl) {
  redis = new Redis(redisUrl);
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ error: 'Database environment variable (REDIS_URL) is completely missing in Vercel. Please add it to your project settings and redeploy!' });
  }

  if (req.method === 'POST') {
    try {
      const { score, mood } = req.body;
      if (typeof score !== 'number' || !mood) {
        return res.status(400).json({ error: 'Missing score or mood' });
      }

      const member = JSON.stringify({ mood, id: Date.now() });
      
      // ioredis ZADD syntax: zadd(key, score, member)
      await redis.zadd('leaderboard:global', score, member);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      // ioredis zrange with REV and WITHSCORES returns a flat array:
      // ["member1", "score1", "member2", "score2"]
      const results = await redis.zrange('leaderboard:global', 0, 4, 'REV', 'WITHSCORES');
      
      let leaderboard = [];
      
      if (Array.isArray(results)) {
        for (let i = 0; i < results.length; i += 2) {
          const memberStr = results[i];
          const scoreStr = results[i + 1];
          
          try {
            const data = JSON.parse(memberStr);
            leaderboard.push({
              score: parseInt(scoreStr, 10),
              mood: data.mood,
              date: data.id
            });
          } catch (err) {
            console.error("Failed to parse member:", memberStr);
          }
        }
      }

      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
