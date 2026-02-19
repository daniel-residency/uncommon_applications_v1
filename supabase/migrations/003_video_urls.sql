-- Add slug column
ALTER TABLE homes ADD COLUMN IF NOT EXISTS slug TEXT;

-- Set slugs for all homes
UPDATE homes SET slug = 'vienna' WHERE name = 'Vienna';
UPDATE homes SET slug = 'homebrew' WHERE name = 'Homebrew';
UPDATE homes SET slug = 'inventors' WHERE name = 'The Inventors Residency';
UPDATE homes SET slug = 'actioners' WHERE name = 'Actioners';
UPDATE homes SET slug = 'bangalore' WHERE name = 'Bangalore';
UPDATE homes SET slug = 'aurea' WHERE name = 'Aurea';
UPDATE homes SET slug = 'arcadia' WHERE name = 'Arcadia';
UPDATE homes SET slug = 'sf2' WHERE name = 'SF2';
UPDATE homes SET slug = 'biopunk' WHERE name = 'Biopunk';
UPDATE homes SET slug = 'london' WHERE name = 'London';

-- Deactivate homes without prompt files
UPDATE homes SET active = false WHERE name IN ('Actioners', 'Aurea', 'London');

-- Reactivate homes with prompt files
UPDATE homes SET active = true WHERE name IN ('Homebrew', 'Bangalore', 'SF2');

-- Fix locations
UPDATE homes SET location = 'New York, NY' WHERE name = 'Homebrew';
UPDATE homes SET location = 'San Francisco, CA' WHERE name = 'Biopunk';

-- Set video URLs
UPDATE homes SET video_url = '/videos/vienna.mp4' WHERE name = 'Vienna';
UPDATE homes SET video_url = '/videos/inventors.mp4' WHERE name = 'The Inventors Residency';
UPDATE homes SET video_url = '/videos/biopunk.mp4' WHERE name = 'Biopunk';
UPDATE homes SET video_url = '/videos/sf_parc.mp4' WHERE name = 'SF PARC';

-- Add new homes
INSERT INTO homes (name, slug, color, location, description_template, matching_prompt, active, display_order)
VALUES
('C-House', 'c-house', '#D4451A', 'Cambridge, MA',
 'Hi {{name}},

Your application stood out. I''m a house in Cambridge for founders and builders with clear commercial or scientific ambition. My residents are working at the frontier of hard problems and they all share a bias toward action. If you''re the kind of person who moves fast and makes things real, you''ll find your people here.',
 'placeholder', true, 11),

('Cornell', 'cornell', '#B31B1B', 'Ithaca, NY',
 'Hi {{name}},

I noticed your application. I''m a residency in Ithaca for builders who thrive in intellectually rigorous, research-adjacent environments. My residents do their best work through deep, sustained focus. If you treat building as a craft that compounds through quiet intensity, this is where you belong.',
 'placeholder', true, 12),

('Odyssey', 'odyssey', '#1B365D', 'San Francisco, CA',
 'Hi {{name}},

Your application caught my attention. I''m a home in San Francisco for venture-backable startups building novel solutions for the good of humanity. My residents have strong traction and a proven track record of being exceptional. If that sounds like you, we should talk.',
 'placeholder', true, 13),

('SF PARC', 'sf_parc', '#7B5B98', 'San Francisco, CA',
 'Hi {{name}},

I was drawn to your application. I''m a home in San Francisco for creative technologists—people who operate at the intersection of engineering, research, and artistic expression. If you see human collaboration as a multiplier on your abilities, you''d thrive here.',
 'placeholder', true, 14)
ON CONFLICT DO NOTHING;

-- NOTE: After running this migration, update matching_prompt for all homes
-- from the prompt files in public/home_prompts/ via the admin API or
-- the PostgREST PATCH endpoint.
