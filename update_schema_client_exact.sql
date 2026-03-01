-- Add the new columns requested by the client

-- Machines table: quantity and description
ALTER TABLE public.machines
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Vendors table: logo_url for company logo
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verify the new schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'machines' OR table_name = 'vendors'
ORDER BY table_name, ordinal_position;
