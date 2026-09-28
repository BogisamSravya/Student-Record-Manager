# Student Record Manager

A modern, responsive, and student-friendly web application designed to manage, validate, and store student records using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. 

This project was built without any external frameworks (No React, Angular, Vue, Bootstrap, Tailwind, or Node.js) and demonstrates fundamental web development, regular expressions, browser data persistence, and robust JavaScript exception handling.

---

## 📌 Project Objective

The primary objective of the **Student Record Manager** is to provide an educational and functional single-page dashboard where users can enroll new students, validate their information in real-time, persist records in browser storage across sessions, and manage the student registry cleanly and intuitively.

---

## 🚀 Features

- **Modern Dashboard UI**: Clean layout featuring header statistics, tabbed navigation, card components, and soft shadows.
- **Form Validation**: Strict client-side verification of Student ID, Full Name, Age, Email Address, and Course.
- **Regex-Powered Email Validation**: Ensures email syntax matches standard formats before permitting submission.
- **Duplicate ID Prevention**: Proactively checks existing records to prevent assigning the same ID to multiple students.
- **Data Persistence via LocalStorage**: Saves student records as JSON in the browser so records persist after refreshing or reopening the browser.
- **Dynamic Table Display**: Renders formatted student records with badges, email links, and actions. Automatically displays an empty state banner when no records exist.
- **Record Deletion with Confirmation**: Confirms before deleting any record and instantly updates storage and view.
- **Exception Handling (try...catch)**: Thorough error trapping across user inputs, JSON parsing, storage operations, and navigation.
- **Live Search Filter**: Search through registered students by ID, Name, or Course.
- **Quick Fill Demo**: One-click button to populate sample student data for convenient testing.
- **Fully Responsive**: Adapts seamlessly to Desktop, Laptop, Tablet, and Mobile screens.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<table>`, `<footer>`) |
| **CSS3** | Modern styling, CSS variables, Flexbox, Grid, transitions, animations, and responsive media queries |
| **Vanilla JavaScript (ES6+)** | DOM manipulation, regular expression validation, event handling, and exception control |
| **Browser `localStorage` API** | Client-side persistent data storage using JSON serialization |

> **Note**: No third-party libraries, CSS frameworks, or external runtime dependencies are used.

---

## 📚 Assignment Concept Mapping

This application directly demonstrates the five core concepts required by the assignment:

### 1. Add Student
- **Implementation**: Handled by the form in `<section id="sectionAddStudent">` and the `addStudent(event)` function.
- **Workflow**:
  1. Gathers user input (`studentId`, `studentName`, `studentAge`, `studentEmail`, `studentCourse`).
  2. Runs inputs through `validateForm()`.
  3. Verifies that the Student ID is unique.
  4. Stores student record in an array of objects:
     ```javascript
     {
       id: 101,
       name: "Sravya",
       age: 20,
       email: "sravya@gmail.com",
       course: "Computer Science"
     }
     ```
  5. Displays confirmation message: `"Student added successfully!"`.
  6. Automatically switches to the records tab and updates the table.

---

### 2. Validate Email Using Regex
- **Implementation**: Handled by `validateEmail(email)` using the required Regular Expression:
  ```javascript
  const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  ```
- **Pattern Breakdown**:
  - `^`: Asserts the start of the string.
  - `[A-Za-z0-9._%+-]+`: Matches one or more alphanumeric characters, dots, underscores, percents, pluses, or hyphens in the local username.
  - `@`: Matches the required `@` separator.
  - `[A-Za-z0-9.-]+`: Matches domain server name (e.g. `gmail`, `college`).
  - `\.`: Matches literal dot before top-level domain.
  - `[A-Za-z]{2,}$`: Requires at least 2 alphabet characters for the domain extension (e.g. `.com`, `.edu`, `.org`) until the end of string.
- **Validation Examples**:
  - Valid: `sravya@gmail.com`, `student123@gmail.com`, `abc.student@college.edu`
  - Invalid: `sravya@gmail`, `sravya@`, `@gmail.com`, `sravya gmail.com`
- **Error Behavior**: If invalid, displays inline error:
  `"Invalid email format. Please enter a valid email address."`

---

### 3. Save Data to File / Browser Storage (`localStorage`)
- **Frontend Context & Architecture**: Because this application is a pure client-side frontend project (HTML/CSS/JavaScript) running without a Node.js server or physical file system permissions, **browser `localStorage`** is used to store and persist student data.
- **Storage Key**: `'students'`
- **Data Format**: JSON string representation of an array of student objects.
- **Functions**:
  - `saveStudents(students)`: Converts JavaScript array to JSON string using `JSON.stringify()` and saves into `localStorage.setItem('students', jsonString)`.
  - Records persist across page reloads, browser tab closing, and browser restarts.

---

### 4. Read Student Data
- **Implementation**: Handled by `loadStudents()` and `displayStudents()`.
- **Workflow**:
  1. Triggered automatically on `DOMContentLoaded` when the page loads.
  2. Reads string from `localStorage.getItem('students')`.
  3. Parses JSON string into a JavaScript array using `JSON.parse()`.
  4. Dynamically builds table rows (`<tr><td>...</td></tr>`) with columns:
     `ID | Name | Age | Email | Course | Action`
  5. If no records exist, displays:
     `"No student records found."`

---

### 5. Handle Invalid Input Using JavaScript Exceptions
- **Implementation**: Comprehensive `try...catch` error handling used throughout `script.js`.
- **Validation Exceptions**:
  - If Student ID is empty: throws `new Error("Student ID is required.")`
  - If Student Name is empty: throws `new Error("Student name is required.")`
  - If Age is invalid (< 15 or > 100 or non-numeric): throws `new Error("Please enter a valid age.")`
  - If Course is empty: throws `new Error("Course is required.")`
  - If Duplicate ID is detected: throws `new Error("Student ID already exists. Please use a different ID.")`
  - If invalid operation/tab is invoked: throws `new Error("Invalid operation. Please try again.")`
- **Storage & Parsing Exceptions**:
  - In `loadStudents()`, if stored data is corrupted (e.g., malformed JSON), the `catch (error)` block catches the syntax error, displays `"An error occurred while loading student records."`, and safely returns an empty array `[]` so the application never crashes.
  - In `saveStudents()`, catches `QuotaExceededError` or permission restrictions.

---

## 📁 Project Structure

```text
student-record-manager/
│
├── index.html     # Semantic HTML5 markup, forms, tables, and modal toasts
├── style.css      # Custom modern CSS3 styling, variables, animations & responsive media queries
├── script.js      # Vanilla JavaScript logic: validation, regex, storage, exceptions, and DOM rendering
└── README.md      # Project documentation, architecture overview, and assignment mapping
```

---

## ⚙️ JavaScript Functions Reference

The codebase is organized into modular, beginner-friendly functions:

| Function | Description |
| :--- | :--- |
| `validateEmail(email)` | Tests an email string against the specified regular expression. |
| `validateForm(data)` | Validates all form inputs and throws descriptive errors if rules fail. |
| `addStudent(event)` | Handles form submission, checks duplicate IDs, saves new records, and updates the UI. |
| `saveStudents(students)` | Serializes student array to JSON and stores in `localStorage` under `try...catch`. |
| `loadStudents()` | Loads and deserializes student records from `localStorage` with exception handling. |
| `displayStudents(list)` | Renders student records into HTML table or shows the empty state. |
| `deleteStudent(studentId)` | Prompts user confirmation, removes student from storage, and refreshes the table. |
| `clearForm()` | Resets all input fields and removes error messages and warning highlights. |
| `showMessage(msg, type)` | Displays a colored notification banner (`success`, `error`, `info`) with auto-dismiss. |
| `switchTab(tabName)` | Toggles between "Add Student" and "Student Records" dashboard views. |
| `handleSearch()` | Real-time filter searching through student records. |
| `fillDemoData()` | Helper function to pre-fill valid test data into the form. |

---

## 🖥️ How to Run the Project

No build steps, node modules, or local servers are required!

1. **Option 1: Direct Browser Launch**
   - Locate `index.html` in your file explorer.
   - Double-click `index.html` (or right-click and choose **Open with** > **Google Chrome** / **Mozilla Firefox** / **Microsoft Edge**).
2. **Option 2: Using VS Code Live Server (Optional)**
   - Open the project directory in VS Code.
   - Right-click `index.html` and select **Open with Live Server**.

---

## 🧪 Example Testing Walkthrough

1. **Test Adding a Valid Student**:
   - Fill in:
     - **Student ID**: `101`
     - **Student Name**: `Sravya`
     - **Age**: `20`
     - **Email**: `sravya@gmail.com`
     - **Course**: `Computer Science`
   - Click **Add Student**.
   - Notice success message: `"Student added successfully!"` and that the table automatically appears with the record.

2. **Test Email Regex Validation**:
   - Enter `sravya@gmail` or `sravya@` in the Email field.
   - Click **Add Student**.
   - Notice the inline error: `"Invalid email format. Please enter a valid email address."`

3. **Test Duplicate ID Prevention**:
   - Attempt to add another student with Student ID `101`.
   - Notice error: `"Student ID already exists. Please use a different ID."`

4. **Test Browser Storage Persistence**:
   - Refresh the browser (press `F5` or `Ctrl+R`).
   - Notice that student `101 (Sravya)` is still present in the table.

5. **Test Deletion with Confirmation**:
   - Click the **Delete** button next to student `101`.
   - A confirmation dialog appears: `"Are you sure you want to delete student..."`.
   - Click **OK**.
   - Notice the success message: `"Student deleted successfully!"` and the table switches to `"No student records found."`
