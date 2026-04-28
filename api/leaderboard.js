import { Redis } from '@upstash/redis';

// Support both the old Vercel KV and new Upstash Redis environment variables
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redis;
if (url && token) {
  redis = new Redis({ url, token });
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ error: 'Database environment variables (KV_REST_API_URL or UPSTASH_REDIS_REST_URL) are completely missing in Vercel. Please link the database in Vercel and redeploy!' });
  }

  if (req.method === 'POST') {
    try {
      const { score, mood } = req.body;
      if (typeof score !== 'number' || !mood) {
        return res.status(400).json({ error: 'Missing score or mood' });
      }

      const member = JSON.stringify({ mood, id: Date.now() });
      
      // ZADD adds to a sorted set, sorted by the score
      await redis.zadd('leaderboard:global', { score, member });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      // Get top 10 scores (descending)
      const results = await redis.zrange('leaderboard:global', 0, 9, { rev: true, withScores: true });
      
      let leaderboard = [];
      
      if (Array.isArray(results)) {
        for (const item of results) {
          if (typeof item === 'object' && item !== null && 'member' in item) {
            // @vercel/kv format: { member: "...", score: 100 }
            const data = typeof item.member === 'string' ? JSON.parse(item.member) : item.member;
            leaderboard.push({
              score: item.score,
              mood: data.mood,
              date: data.id
            });
          } else if (typeof item === 'string') {
            // Older redis format: flat array [member, score, member, score]
            // We'll skip handling this rare edge case since @vercel/kv formats it to objects.
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
