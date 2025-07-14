# SOSE TestHub - Global Smart Test Platform

A comprehensive online testing platform designed for modern education with advanced features for teachers and students.

## 🚀 Features

### For Teachers
- **Admin-Assigned Accounts**: Teachers are pre-registered by administration
- **Test Creation**: Create tests with multiple question types (MCQ, Short Answer, Essay)
- **LaTeX Support**: Advanced mathematical and scientific notation
- **PDF Import**: Bulk import questions from PDF files
- **Question Bank**: Manage reusable questions
- **Real-time Analytics**: Detailed performance insights
- **Report Cards**: Generate professional PDF report cards
- **Global Access**: Access dashboard from anywhere

### For Students
- **Easy Access**: Join tests using simple test codes
- **No Registration**: Just enter name and test code
- **Secure Testing**: Tab switch detection and time limits
- **Real-time Submission**: Instant submission to database

## 🔧 Setup Instructions

### Option 1: Demo Mode (Works Immediately)
The application includes a complete demo mode that works without any setup:

**Demo Teacher Login:**
- Email: `teacher@sose.edu`
- Password: `password123`

**Demo Features:**
- Create and manage tests
- Import questions from PDF
- Generate report cards
- All functionality works with mock data

### Option 2: Production Setup with Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set Environment Variables**
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Database Migrations**
   - The SQL migration file is in `supabase/migrations/`
   - Run it in your Supabase SQL editor

4. **Add Teachers (Admin Only)**
   ```sql
   INSERT INTO teachers (email, name, subject, school) VALUES
   ('teacher@school.edu', 'Teacher Name', 'Subject', 'School Name');
   ```

## 📚 How to Use

### Creating Tests
1. Login as teacher
2. Go to "Create Test"
3. Add test details and questions
4. Use LaTeX for mathematical expressions: `$x^2 + y^2 = z^2$`
5. Save test to get unique test code

### Importing Questions from PDF
1. Go to "Question Bank"
2. Click "Import from PDF"
3. Upload PDF with properly formatted questions
4. Preview and confirm import

### PDF Format for Import
```
1. What is the value of x in $2x + 5 = 15$?
   a) 3
   b) 5
   c) 10
   d) 15
   Answer: b
   [2 marks]

2. Calculate $\int_{0}^{1} x^2 dx$
   [3 marks]
```

### LaTeX Examples
- Fractions: `$\frac{a}{b}$`
- Superscripts: `$x^2$`
- Subscripts: `$H_2O$`
- Integrals: `$\int_{0}^{1} x dx$`
- Greek letters: `$\alpha, \beta, \gamma$`

### Student Testing
1. Students go to the website
2. Click "Take Test"
3. Enter name and test code
4. Complete test within time limit
5. Submit for automatic grading

### Generating Report Cards
1. Go to "Report Card Hub"
2. Select test and student/class
3. Generate professional PDF reports
4. Download or email reports

## 🔒 Security Features
- Row Level Security (RLS) on all database tables
- Teachers can only access their own data
- Secure test code validation
- Tab switch detection during tests
- IP address logging

## 🌐 Deployment
The application is deployed at: https://soft-kataifi-5427b7.netlify.app

## 📱 Mobile Friendly
- Responsive design works on all devices
- Touch-friendly interface
- Mobile-optimized test taking experience

## 🎯 Key Benefits
- **No Setup Required**: Demo mode works immediately
- **Professional Reports**: High-quality PDF generation
- **Advanced Math Support**: Full LaTeX rendering
- **Bulk Import**: Efficient question management
- **Global Access**: Works from anywhere with internet
- **Secure**: Enterprise-grade security features

## 🛠 Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **PDF Generation**: jsPDF + html2canvas
- **Math Rendering**: MathJax 3
- **PDF Processing**: PDF.js
- **Deployment**: Netlify

## 📞 Support
For technical support or teacher account creation, contact your system administrator.

---

**Built for SOSE Lajpat Nagar** - Designed by Aftab Alam, Class 10th A