import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('priority', { ascending: false })
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: error.message || 'Failed to fetch notices' });
      }

      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { title, body, category, priority, publishDate, image } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!body || !body.trim()) {
        return res.status(400).json({ error: 'Body is required' });
      }
      if (!publishDate) {
        return res.status(400).json({ error: 'Publish date is required' });
      }

      const date = new Date(publishDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid publish date' });
      }

      const { data, error } = await supabase
        .from('notices')
        .insert({
          id: randomUUID(),
          title: title.trim(),
          body: body.trim(),
          category: category || 'General',
          priority: priority || 'Normal',
          publish_date: date.toISOString(),
          image: image && image.trim() ? image.trim() : null,
        })
        .select();

      if (error) {
        console.error('Supabase INSERT error:', error);
        return res.status(500).json({ error: error.message || 'Failed to create notice' });
      }

      return res.status(201).json(data?.[0] || {});
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
