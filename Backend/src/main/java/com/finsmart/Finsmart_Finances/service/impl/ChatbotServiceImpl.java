package com.finsmart.Finsmart_Finances.service.impl;

import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.service.ChatbotService;

@Service
public class ChatbotServiceImpl implements ChatbotService {
    @Override
    public String getChatbotReply(String message) {
        System.out.println("ChatbotServiceImpl.getChatbotReply called with: " + message);
        
        String lowerMessage = message.toLowerCase();
        
        // Basic chatbot responses for common financial questions
        if (lowerMessage.contains("hello") || lowerMessage.contains("hi")) {
            return "Hello! I'm your FinSmart financial assistant. How can I help you today?";
        }
        
        if (lowerMessage.contains("expense") || lowerMessage.contains("spending")) {
            return "To track your expenses in FinSmart:\n1. Go to the Expenses section\n2. Click 'Add Expense'\n3. Enter the amount, category, and date\n4. Save to keep track of your spending";
        }
        
        if (lowerMessage.contains("investment") || lowerMessage.contains("invest")) {
            return "For investments in FinSmart:\n1. Visit the Investment section\n2. Set up investment goals\n3. Track your portfolio\n4. Monitor performance with charts and reports";
        }
        
        if (lowerMessage.contains("tax") || lowerMessage.contains("taxes")) {
            return "FinSmart helps with tax management:\n1. Go to Tax Profile section\n2. Enter your tax details\n3. Track deductions and credits\n4. Get tax-saving recommendations";
        }
        
        if (lowerMessage.contains("stock") || lowerMessage.contains("portfolio")) {
            return "Manage your stock portfolio:\n1. Navigate to Stock Portfolio\n2. Add your stock holdings\n3. Track transactions\n4. Monitor real-time performance";
        }
        
        if (lowerMessage.contains("report") || lowerMessage.contains("analytics")) {
            return "View detailed reports:\n1. Go to Reports section\n2. Choose from expense, investment, or tax reports\n3. Analyze your financial health\n4. Export data if needed";
        }
        
        if (lowerMessage.contains("help") || lowerMessage.contains("support")) {
            return "Need help? Here are your options:\n1. Check the Help section for guides\n2. Use the chatbot for quick questions\n3. Contact support through the app\n4. Browse our FAQ section";
        }
        
        if (lowerMessage.contains("budget") || lowerMessage.contains("saving")) {
            return "Budgeting tips with FinSmart:\n1. Set monthly spending limits\n2. Track expenses by category\n3. Review spending patterns\n4. Adjust budgets based on reports";
        }
        
        if (lowerMessage.contains("goal") || lowerMessage.contains("target")) {
            return "Set financial goals:\n1. Create investment goals\n2. Set target amounts and timelines\n3. Track progress regularly\n4. Celebrate when you reach milestones!";
        }
        
        // Default response for unrecognized queries
        return "I'm here to help with your financial questions! You can ask me about:\n" +
               "• Expense tracking\n" +
               "• Investment management\n" +
               "• Tax planning\n" +
               "• Stock portfolio\n" +
               "• Financial reports\n" +
               "• Budgeting tips\n" +
               "• Setting financial goals\n\n" +
               "What would you like to know more about?";
    }
} 