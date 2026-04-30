-- Fix the dtype values in existing records
USE finsmart;

-- Update any records with NULL or empty dtype values
UPDATE investment_goals SET dtype = 'InvestmentGoal' WHERE dtype IS NULL OR dtype = '';

-- Verify the fix
SELECT id, goal_name, dtype FROM investment_goals; 