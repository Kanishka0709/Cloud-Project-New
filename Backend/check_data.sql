-- Check the current data in investment_goals table
USE finsmart;

-- Check if there's any data
SELECT COUNT(*) as total_records FROM investment_goals;

-- Check the structure again
DESCRIBE investment_goals;

-- Check if there are any records with problematic data
SELECT * FROM investment_goals LIMIT 5; 