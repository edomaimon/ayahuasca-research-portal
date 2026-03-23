-- ============================================================
-- Ayahuasca Research Portal — Initial Schema
-- ============================================================

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  authors TEXT[] DEFAULT '{}',
  journal TEXT NOT NULL,
  year INTEGER NOT NULL,
  doi TEXT UNIQUE,
  pmid TEXT,
  abstract TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  citations INTEGER DEFAULT 0,
  verification TEXT DEFAULT 'DOI',
  study_type TEXT,
  open_access BOOLEAN DEFAULT FALSE,
  participants INTEGER,
  fts TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_year ON articles (year);
CREATE INDEX IF NOT EXISTS idx_articles_doi ON articles (doi);
CREATE INDEX IF NOT EXISTS idx_articles_journal ON articles (journal);
CREATE INDEX IF NOT EXISTS idx_articles_fts ON articles USING GIN (fts);

-- Trigger to populate fts tsvector on insert/update
CREATE OR REPLACE FUNCTION articles_fts_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.abstract, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_fts_trigger
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION articles_fts_update();

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON articles
  FOR SELECT
  USING (true);

-- Service role can insert/update/delete
CREATE POLICY "Service role full access" ON articles
  FOR ALL
  USING (true)
  WITH CHECK (true);
