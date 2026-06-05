import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(404).json({ error: 'Notice not found' });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { title, body, category, priority, publishDate, image } = req.body;

      // Server-side validation
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

      console.log('Updating notice with id:', id);

      const { data, error } = await supabase
        .from('notices')
        .update({
          title: title.trim(),
          body: body.trim(),
          category: category || 'General',
          priority: priority || 'Normal',
          publish_date: date.toISOString(),
          image: image && image.trim() ? image.trim() : null,
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase UPDATE error:', error);
        return res.status(500).json({ error: error.message || 'Failed to update notice' });
      }

      return res.status(200).json(data?.[0] || {});
    }

    if (req.method === 'DELETE') {
      console.log('Deleting notice with id:', id);

      const { error } = await supabase.from('notices').delete().eq('id', id);

      if (error) {
        console.error('Supabase DELETE error:', error);
        return res.status(500).json({ error: error.message || 'Failed to delete notice' });
      }

      return res.status(204).send('');
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
