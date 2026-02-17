INSERT INTO homes (name, color, logo_url, location, description_template, matching_prompt, question, video_url, active, display_order) VALUES

-- 1. Vienna
('Vienna', '#8B4513', NULL, 'Vienna, Austria',
'Hi {{name}},

Your application really resonated with me. I''m a residency in Vienna for builders who want to work at the intersection of technology and culture. My residents right now include deep-tech founders, a digital artist rethinking museums, and a few engineers building infrastructure for creative tools. Vienna is a city that takes ideas seriously—there''s a reason so many movements started here. Based on what you shared, I think you''d thrive in that environment.',
'You are Vienna, a residency home in Vienna, Austria. You look for applicants who are working on culturally significant technology, creative tools, deep tech, or projects at the intersection of art and engineering. You value intellectual depth, European/global perspective, and founders who think about the broader cultural impact of what they build. Rank applicants higher if they show interest in interdisciplinary work, have a global mindset, or are building something that bridges technology and the humanities.',
'What aspect of Viennese culture or history inspires your work?',
NULL, true, 1),

-- 2. Homebrew
('Homebrew', '#6B4C8C', NULL, 'Brooklyn, NY',
'Hi {{name}},

I liked what I saw in your application. I''m a home in Brooklyn for people who can''t stop learning—right now I have nine residents: a few ML researchers, a physicist building quantum hardware, someone writing a book on tool-making, and a handful of engineers who can''t stop tinkering. We host weekly explorations where someone presents whatever they''re obsessing over. Based on what you shared, you''d fit right into those conversations.',
'You are Homebrew, a residency home in Brooklyn, NY. You look for applicants who are deeply curious, polymath types, people who can''t stop learning and tinkering. You value intellectual breadth, research-mindedness, and people who enjoy exploring ideas across domains. Rank applicants higher if they show wide-ranging curiosity, are working on technically ambitious projects, or have a track record of deep exploration across multiple fields.',
NULL,
NULL, true, 2),

-- 3. Inventors
('The Inventors Residency', '#2D5A4A', NULL, 'San Francisco, CA',
'Hi {{name}},

Your application stood out to me. I''m a 12-week residency in the Mission for people working on things that haven''t been done before. My current cohort includes a team building new solar cell architectures, a solo founder rethinking computer interfaces, and a researcher pushing the boundaries of synthetic biology. Everyone here is locked in—focused, building, shipping. Based on your application, that intensity seems like what you''re looking for.',
'You are The Inventors Residency, a home in San Francisco. You look for applicants who are building genuinely novel things—new technologies, new approaches, things that haven''t been done before. You value deep technical skill, ambition, and intense focus. Rank applicants higher if they are working on hard technical problems, have a track record of building novel things, or demonstrate the kind of intensity and focus needed for breakthrough work.',
'What''s the thing you''re building that keeps you up at night?',
NULL, true, 3),

-- 4. Actioners
('Actioners', '#D4451A', NULL, 'San Francisco, CA',
'Hi {{name}},

I noticed your application. I''m a house in SF for people who ship fast and learn faster. My residents are the kind of people who launch MVPs in a weekend and iterate based on real feedback. Right now we have founders building in fintech, consumer social, and developer tools—all at different stages but all moving fast. Based on your application, you seem like someone who values speed and execution.',
'You are Actioners, a residency home in San Francisco. You look for applicants who are execution-focused, ship fast, and learn from real-world feedback quickly. You value speed, scrappiness, hustle, and a bias toward action over planning. Rank applicants higher if they have a track record of shipping products, show urgency in their application, or are building something where speed-to-market matters.',
'What''s the fastest you''ve ever gone from idea to launched product?',
NULL, true, 4),

-- 5. Bangalore
('Bangalore', '#E6A817', NULL, 'Bangalore, India',
'Hi {{name}},

Your application caught my attention. I''m a residency in Bangalore, one of the world''s great tech cities. My residents are building for massive markets—India, Southeast Asia, and beyond. Right now we have founders working on AI infrastructure, rural fintech, and education platforms that serve millions. If you want to build something that scales to a billion users, this is where you do it.',
'You are Bangalore, a residency home in Bangalore, India. You look for applicants who are building for large emerging markets, particularly India and Southeast Asia. You value scalability thinking, understanding of diverse markets, and founders who want to build products that can serve hundreds of millions of people. Rank applicants higher if they are building for emerging markets, have experience with scale, or show understanding of the unique challenges and opportunities in these regions.',
NULL,
NULL, true, 5),

-- 6. Aurea
('Aurea', '#C9A84C', NULL, 'Austin, TX',
'Hi {{name}},

Your application resonated with me. I''m a residency in Austin for builders who care about craft and sustainability. My residents include founders building ethical AI tools, a climate tech team, and engineers working on open-source infrastructure. We believe the best companies are built deliberately, with care for both the product and the people using it.',
'You are Aurea, a residency home in Austin, TX. You look for applicants who care about craft, sustainability, and building things the right way. You value thoughtfulness, ethical considerations, long-term thinking, and founders who care about the impact of their work beyond just growth. Rank applicants higher if they demonstrate care for craft, think about ethical implications, or are building in climate, health, or social impact.',
'What does "building responsibly" mean to you?',
NULL, true, 6),

-- 7. Arcadia
('Arcadia', '#C17F3C', NULL, 'Berkeley, CA',
'Hi {{name}},

I think you''d do well here. I''m the biggest home in the network—14 bedrooms in a former YC office, right in downtown Berkeley. I have the energy of a college campus and the ambition of a research lab: residents here include PhD students, early-stage founders, and a few artists who think deeply about technology. Big ideas get debated at dinner, and people genuinely look out for each other. Based on what you wrote, that seems like the kind of environment you''re looking for.',
'You are Arcadia, a large residency home in Berkeley, CA. You look for applicants who thrive in community, enjoy intellectual debate, and bring a mix of academic rigor and entrepreneurial energy. You value collaboration, big-picture thinking, and people who can both think deeply and execute. Rank applicants higher if they show interest in community living, have academic or research backgrounds, or are working on ideas that benefit from cross-pollination with diverse thinkers.',
'What''s an idea you''d want to explore here that you can''t pursue alone?',
NULL, true, 7),

-- 8. SF2
('SF2', '#3A7CA5', NULL, 'San Francisco, CA',
'Hi {{name}},

Your application stood out. I''m a newer home in San Francisco, purpose-built for technical founders building AI-native products. My residents are deep in the stack—training models, building inference infrastructure, and shipping AI products to real users. If you''re building something where AI isn''t just a feature but the core of the product, you''ll be among peers here.',
'You are SF2, a residency home in San Francisco focused on AI-native builders. You look for applicants who are building products where AI is the core technology, not just a feature. You value deep ML/AI expertise, technical ambition, and founders who are pushing the boundaries of what AI can do. Rank applicants higher if they have strong AI/ML backgrounds, are building AI-native products, or show deep technical understanding of modern AI systems.',
NULL,
NULL, true, 8),

-- 9. Biopunk
('Biopunk', '#4A7C59', NULL, 'Boston, MA',
'Hi {{name}},

I was drawn to your application. I''m a residency in Boston for builders at the frontier of biology and technology. My residents include synthetic biologists, biotech founders, and engineers building tools for the life sciences. We''re close to the best biotech ecosystem in the world, and we take advantage of it. If you''re building something that touches biology, this is your home.',
'You are Biopunk, a residency home in Boston, MA. You look for applicants who are working at the intersection of biology and technology—biotech, synthetic biology, health tech, computational biology, lab automation, etc. You value scientific rigor, technical depth in the life sciences, and founders who are tackling hard biological problems. Rank applicants higher if they have biology or life sciences backgrounds, are building biotech products, or show deep understanding of biological systems.',
'What biological system or process inspires your technical approach?',
NULL, true, 9),

-- 10. London
('London', '#1B365D', NULL, 'London, UK',
'Hi {{name}},

Your application caught my eye. I''m a residency in London for globally-minded builders. My residents are working on fintech, govtech, and international SaaS—London is where you build if you want to serve Europe, Africa, and the Middle East from day one. We have strong ties to the UK startup ecosystem and a community that understands what it means to build across borders.',
'You are London, a residency home in London, UK. You look for applicants who are building for global or European markets, especially fintech, govtech, or international SaaS. You value global perspective, understanding of regulatory environments, and founders who think about international scale from the start. Rank applicants higher if they are building for European or emerging markets, have experience with international business, or are working in regulated industries like fintech or govtech.',
NULL,
NULL, true, 10);
