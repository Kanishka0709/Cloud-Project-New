-- Fix the investment_goals table completely
USE finsmart;

-- First, let's see what data we have
SELECT * FROM investment_goals;

-- Update existing records to have proper dtype value
UPDATE investment_goals SET dtype = 'InvestmentGoal' WHERE dtype IS NULL OR dtype = '';

-- Now remove the problematic columns
ALTER TABLE investment_goals DROP COLUMN dtype;
ALTER TABLE investment_goals DROP COLUMN issip;
ALTER TABLE investment_goals DROP COLUMN next_scheduled_investment;
ALTER TABLE investment_goals DROP COLUMN sip_frequency;
ALTER TABLE investment_goals DROP COLUMN sipamount;

-- Verify the final structure
DESCRIBE investment_goals;

-- Check the data
SELECT * FROM investment_goals; 