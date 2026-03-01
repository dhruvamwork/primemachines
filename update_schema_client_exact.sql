-- Add the new exact client requested columns to the machines table

ALTER TABLE public.machines
ADD COLUMN quantity INTEGER DEFAULT 1,
ADD COLUMN description TEXT;

-- Verify the new schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'machines';
