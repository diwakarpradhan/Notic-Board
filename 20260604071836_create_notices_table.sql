/*
  # Create notices table
  
  Creates the notices table with all required fields for the notice board application.
  
  1. New Tables
    - `notices`
      - `id` (text, primary key using cuid)
      - `title` (text, required)
      - `body` (text, required)  
      - `category` (text, defaults to 'General')
      - `priority` (text, defaults to 'Normal')
      - `publish_date` (timestamp with timezone)
      - `image` (text, nullable for optional images)
      - `created_at` (timestamp, defaults to current time)
      - `updated_at` (timestamp, updates automatically)
*/

CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL DEFAULT 'Normal',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for priority and publish_date queries
CREATE INDEX IF NOT EXISTS notices_priority_publish_date_idx 
ON notices(priority DESC, publish_date DESC);

CREATE INDEX IF NOT EXISTS notices_category_idx 
ON notices(category);
