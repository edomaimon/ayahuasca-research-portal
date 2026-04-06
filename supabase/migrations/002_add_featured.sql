-- Add featured column to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (featured) WHERE featured = true;

-- Mark 3 landmark ayahuasca papers as featured
-- 1. First RCT of ayahuasca for treatment-resistant depression (Palhano-Fontes et al., 2019)
UPDATE articles SET featured = true
WHERE doi = '10.1017/S0033291718001356';

-- 2. Antidepressant effects of ayahuasca - open-label trial (Osório et al., 2015)
UPDATE articles SET featured = true
WHERE doi = '10.1177/0269881114568039';

-- 3. Hallak et al. - Human pharmacology of ayahuasca (2023 or foundational review)
-- Fallback: pick a highly-cited clinical trial if above DOIs don't exist
UPDATE articles SET featured = true
WHERE doi = '10.1038/s41398-021-01497-2';
