# Finsmart Finances - Frontend

A comprehensive financial management web application built with React.js that helps users track expenses, investments, stocks, and tax profiles.

## 🚀 Features

### 📊 **Dashboard & Analytics**
- Interactive financial dashboard with charts and statistics
- Real-time overview of expenses, investments, stocks, and tax data
- Visual breakdowns using pie charts, bar charts, and line charts

### 💰 **Expense Management**
- Add, edit, and delete expenses with categories
- PDF download functionality for expense reports
- Expense tracking with detailed analytics

### 📈 **Investment Tracking**
- Manage investment goals and SIP (Systematic Investment Plans)
- Track investment transactions with pagination
- PDF download for investment reports
- SIP Calculator for planning investments

### 📊 **Stock Portfolio**
- Stock holdings and transaction management
- Portfolio value tracking
- PDF download for stock reports
- Sector-wise portfolio breakdown

### 📋 **Tax Profile Management**
- Tax profile creation and management
- Yearly tax statistics
- Outstanding reports tracking
- PDF download for tax reports

### 📄 **Comprehensive Reports**
- Detailed financial reports combining all data
- PDF download for comprehensive reports
- Investment transaction pagination

### 🔐 **User Authentication**
- Secure login and signup system
- "Remember me" functionality
- Forgot password with email validation
- Password reset functionality

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Modern card-based layout
- Toast notifications for user feedback
- Consistent design system with CSS variables

## 🛠️ Technologies Used

- **Frontend**: React.js, JavaScript (ES6+)
- **Styling**: CSS3, CSS Variables, Responsive Design
- **Charts**: Recharts library
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devashri26/finsmartbackend-frontend.git
   cd finsmart-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
src/
├── api/                 # API configuration and endpoints
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── routes/             # Routing configuration
├── styles/             # CSS stylesheets
└── index.js            # Application entry point
```

## 🔧 Configuration

The application connects to a Spring Boot backend. Make sure to:

1. Update API endpoints in `src/api/axiosConfig.js` if needed
2. Configure CORS settings on the backend
3. Set up proper environment variables for production

## 📱 Features Overview

### PDF Downloads
- **Expenses**: Download all expenses with summary
- **Investments**: Download investment goals and transactions
- **Stocks**: Download stock holdings and transactions
- **Tax Profiles**: Download tax profiles and summaries
- **Reports**: Download comprehensive financial reports

### Pagination
- Smart pagination with ellipsis for large datasets
- Implemented in Reports and Investment pages
- User-friendly navigation controls

### Authentication
- Secure login with "Remember me" functionality
- Email validation for forgot password
- User session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Devashri** - *Initial work* - [devashri26](https://github.com/devashri26)

## 🙏 Acknowledgments

- React.js community
- Create React App team
- Recharts library contributors
- All contributors and supporters

---

**Finsmart Finances** - Your comprehensive financial management solution! 💰📊
