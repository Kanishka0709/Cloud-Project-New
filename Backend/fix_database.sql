-- Fix the investment_goals table by removing the dtype column
USE finsmart;

-- Drop the dtype column if it exists
ALTER TABLE investment_goals DROP COLUMN IF EXISTS dtype;

-- Verify the table structure
DESCRIBE investment_goals; 