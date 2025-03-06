/*
  # Create documents table for RAG system

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `embedding` (vector)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
  2. Security
    - Enable RLS on `documents` table
    - Add policies for authenticated users
*/

-- Enable the vector extension
create extension if not exists vector;

-- Create documents table
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id)
);

-- Enable RLS
alter table documents enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read their own documents" on documents;
drop policy if exists "Users can insert their own documents" on documents;

-- Create policies
create policy "Users can read their own documents"
  on documents
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on documents
  for insert
  to authenticated
  with check (auth.uid() = user_id);
