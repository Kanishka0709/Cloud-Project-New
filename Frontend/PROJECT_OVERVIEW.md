# 🏦 Finsmart Finances - Complete Project Overview

## 📋 Project Structure

This is a full-stack financial management application with both frontend and backend in the same repository:

### 🎨 **Frontend (Main Branch)**
- **Technology**: React.js, JavaScript, CSS3
- **Location**: Root directory of the repository
- **Branch**: `main`

### ⚙️ **Backend (Backend Branch)**
- **Technology**: Spring Boot, Java, MySQL
- **Location**: Backend branch of the repository
- **Branch**: `backend`

## 🚀 Quick Start Guide

### 1. **Clone the Repository**
```bash
# Clone the main repository
git clone https://github.com/devashri26/finsmartbackend-frontend.git
cd finsmartbackend-frontend
```

### 2. **Backend Setup**
```bash
# Switch to backend branch
git checkout backend

# Open in your IDE (IntelliJ IDEA, Eclipse, or VS Code)
# Configure MySQL database in application.properties
# Run the Spring Boot application
```

### 3. **Frontend Setup**
```bash
# Switch back to main branch for frontend
git checkout main

# Install dependencies
npm install

# Start the development server
npm start
```

### 3. **Database Setup**
- Create a MySQL database named `finsmart_finances`
- Update database credentials in `src/main/resources/application.properties`
- Run the SQL scripts in the backend repository

## 🔧 Configuration

### Frontend Environment Variables (`.env`)
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_ENV=development
```

### Backend Configuration (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/finsmart_finances
spring.datasource.username=your_username
spring.datasource.password=your_password

# Server Configuration
server.port=8080

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
```

## 📊 Features Overview

### ✅ **Implemented Features**

#### **Frontend Features**
- 📊 **Dashboard**: Interactive charts and financial overview
- 💰 **Expense Management**: Add, edit, delete expenses with PDF export
- 📈 **Investment Tracking**: Goals, transactions, SIP calculator with PDF export
- 📊 **Stock Portfolio**: Holdings, transactions, portfolio analysis with PDF export
- 📋 **Tax Profile**: Tax management with PDF export
- 📄 **Reports**: Comprehensive financial reports with PDF export
- 🔐 **Authentication**: Login, signup, forgot password with email validation
- 🎨 **Modern UI**: Responsive design with CSS variables and reusable components

#### **Backend Features**
- 🔐 **Spring Security**: JWT authentication and authorization
- 📊 **RESTful APIs**: Complete CRUD operations for all entities
- 💾 **Database**: MySQL with JPA/Hibernate
- 📧 **Email Service**: Password reset functionality
- 🤖 **Chatbot API**: Integration with external chatbot service
- 🔄 **CORS Configuration**: Cross-origin resource sharing
- 📝 **Exception Handling**: Comprehensive error management

### 📁 **API Endpoints**

#### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/logout` - User logout

#### **Users**
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### **Expenses**
- `GET /expenses` - Get all expenses
- `POST /expenses` - Create expense
- `PUT /expenses/{id}` - Update expense
- `DELETE /expenses/{id}` - Delete expense

#### **Investments**
- `GET /investments` - Get all investment goals
- `POST /investments` - Create investment goal
- `PUT /investments/{id}` - Update investment goal
- `DELETE /investments/{id}` - Delete investment goal

#### **Stocks**
- `GET /stocks` - Get all stocks
- `POST /stocks` - Create stock
- `PUT /stocks/{id}` - Update stock
- `DELETE /stocks/{id}` - Delete stock

#### **Tax Profiles**
- `GET /tax-profiles` - Get all tax profiles
- `POST /tax-profiles` - Create tax profile
- `PUT /tax-profiles/{id}` - Update tax profile
- `DELETE /tax-profiles/{id}` - Delete tax profile

## 🛠️ Development Tools

### **Frontend Development**
- **IDE**: VS Code, WebStorm, or any code editor
- **Package Manager**: npm
- **Development Server**: http://localhost:3000
- **Build Tool**: Create React App

### **Backend Development**
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code with Java extensions
- **Build Tool**: Maven
- **Development Server**: http://localhost:8080
- **Database**: MySQL Workbench or any MySQL client

## 🔍 Testing

### **API Testing**
- Visit `http://localhost:3000/api-test` to test all API endpoints
- Check browser console for detailed error messages
- Use Postman or similar tools for API testing

### **Frontend Testing**
- Run `npm test` for unit tests
- Run `npm run build` for production build
- Check for ESLint warnings and errors

## 📦 Deployment

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to GitHub Pages, Netlify, or Vercel
```

### **Backend Deployment**
- Deploy to AWS, Heroku, or any Java hosting platform
- Update frontend API base URL for production
- Configure production database

## 🤝 Contributing

1. Fork the repositories
2. Create feature branches
3. Make your changes
4. Test thoroughly
5. Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Devashri** - *Full Stack Developer* - [devashri26](https://github.com/devashri26)

## 🙏 Acknowledgments

- React.js community
- Spring Boot team
- MySQL community
- All contributors and supporters

---

**Finsmart Finances** - Your comprehensive financial management solution! 💰📊

## 🔗 Quick Links

- **Main Repository**: https://github.com/devashri26/finsmartbackend-frontend
- **Frontend Branch**: `main`
- **Backend Branch**: `backend`
- **Live Demo**: [Coming Soon]
- **Documentation**: [Coming Soon] 