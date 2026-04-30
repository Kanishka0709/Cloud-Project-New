-- Clean up the investment_goals table by removing problematic columns
USE finsmart;

-- Remove the dtype column that's causing the error
ALTER TABLE investment_goals DROP COLUMN dtype;

-- Remove SIP-related columns that are no longer needed
ALTER TABLE investment_goals DROP COLUMN issip;
ALTER TABLE investment_goals DROP COLUMN next_scheduled_investment;
ALTER TABLE investment_goals DROP COLUMN sip_frequency;
ALTER TABLE investment_goals DROP COLUMN sipamount;

-- Verify the cleaned table structure
DESCRIBE investment_goals; 