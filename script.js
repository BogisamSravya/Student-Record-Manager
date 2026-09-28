/**
 * ==============================================================================
 * Student Record Manager
 * Pure Vanilla JavaScript (ES6+) Implementation
 * 
 * Features Demonstrated:
 * 1. Add Student (Form processing)
 * 2. Validate Email using Regex (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
 * 3. Save Data to Browser Storage (localStorage as JSON)
 * 4. Read Student Data (Render into HTML table on page load)
 * 5. Handle Invalid Input & Storage errors using JavaScript Exceptions (try...catch)
 * ==============================================================================
 */

// Key used to store student records in localStorage
const STORAGE_KEY = 'students';

// Regular Expression for validating email format
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Timer reference for dismissing notification banner
let alertDismissTimeout = null;

// ------------------------------------------------------------------------------
// 1. Initialization on DOM Content Loaded
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initial display of students on page load
    displayStudents();
    updateBadges();

    // Attach close button listener to alert notification banner
    const alertCloseBtn = document.getElementById('alertCloseBtn');
    if (alertCloseBtn) {
      alertCloseBtn.addEventListener('click', hideMessage);
    }

    // Attach real-time input event listeners to clear field errors when user types
    const fields = [
      { inputId: 'studentId', errorId: 'idError' },
      { inputId: 'studentName', errorId: 'nameError' },
      { inputId: 'studentAge', errorId: 'ageError' },
      { inputId: 'studentEmail', errorId: 'emailError' },
      { inputId: 'studentCourse', errorId: 'courseError' }
    ];

    fields.forEach(({ inputId, errorId }) => {
      const inputEl = document.getElementById(inputId);
      if (inputEl) {
        inputEl.addEventListener('input', () => {
          inputEl.classList.remove('input-error');
          const errEl = document.getElementById(errorId);
          if (errEl) errEl.textContent = '';
        });
        inputEl.addEventListener('change', () => {
          inputEl.classList.remove('input-error');
          const errEl = document.getElementById(errorId);
          if (errEl) errEl.textContent = '';
        });
      }
    });

  } catch (error) {
    console.error('Initialization error:', error);
    showMessage('An error occurred while loading student records.', 'error');
  }
});

// ------------------------------------------------------------------------------
// 2. Email Validation Using Regular Expression
// ------------------------------------------------------------------------------
/**
 * Validates an email address against the assignment regex pattern.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if email is valid according to the regex, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

// ------------------------------------------------------------------------------
// 3. Exception-Based Form Validation
// ------------------------------------------------------------------------------
/**
 * Validates student form data and displays field-specific error messages.
 * Uses JavaScript exceptions (throw new Error) to enforce validation rules.
 * 
 * @param {Object} data - Student form field values { id, name, age, email, course }
 * @throws {Error} Throws specific error messages when input validation fails.
 */
function validateForm(data) {
  // Clear previous inline errors
  clearFieldErrors();

  let hasError = false;

  // 1. Validate Student ID
  if (!data.idStr || data.idStr.trim() === '') {
    setFieldError('idError', 'Student ID is required.', 'studentId');
    hasError = true;
  } else {
    const parsedId = Number(data.idStr);
    if (isNaN(parsedId) || parsedId <= 0 || !Number.isInteger(parsedId)) {
      setFieldError('idError', 'Student ID must be a valid positive number.', 'studentId');
      hasError = true;
    }
  }

  // 2. Validate Student Name
  if (!data.name || data.name.trim() === '') {
    setFieldError('nameError', 'Student name is required.', 'studentName');
    hasError = true;
  } else if (data.name.trim().length < 2) {
    setFieldError('nameError', 'Student name must be at least 2 characters.', 'studentName');
    hasError = true;
  }

  // 3. Validate Age
  if (!data.ageStr || data.ageStr.trim() === '') {
    setFieldError('ageError', 'Please enter a valid age.', 'studentAge');
    hasError = true;
  } else {
    const parsedAge = Number(data.ageStr);
    // Reasonable student age range (e.g. 15 to 100)
    if (isNaN(parsedAge) || parsedAge < 15 || parsedAge > 100 || !Number.isInteger(parsedAge)) {
      setFieldError('ageError', 'Please enter a valid age.', 'studentAge');
      hasError = true;
    }
  }

  // 4. Validate Email using Regex
  if (!data.email || data.email.trim() === '') {
    setFieldError('emailError', 'Email is required.', 'studentEmail');
    hasError = true;
  } else if (!validateEmail(data.email)) {
    setFieldError('emailError', 'Invalid email format. Please enter a valid email address.', 'studentEmail');
    hasError = true;
  }

  // 5. Validate Course
  if (!data.course || data.course.trim() === '') {
    setFieldError('courseError', 'Course is required.', 'studentCourse');
    hasError = true;
  }

  // If any field validation failed, throw an exception with the first applicable message
  if (hasError) {
    if (!data.idStr || data.idStr.trim() === '') {
      throw new Error('Student ID is required.');
    }
    if (!data.name || data.name.trim() === '') {
      throw new Error('Student name is required.');
    }
    if (!data.ageStr || isNaN(Number(data.ageStr)) || Number(data.ageStr) < 15 || Number(data.ageStr) > 100) {
      throw new Error('Please enter a valid age.');
    }
    if (!data.email || !validateEmail(data.email)) {
      throw new Error('Invalid email format. Please enter a valid email address.');
    }
    if (!data.course || data.course.trim() === '') {
      throw new Error('Course is required.');
    }
    throw new Error('Please fix the errors in the form.');
  }

  return true;
}

// ------------------------------------------------------------------------------
// 4. Save Students to Browser Storage (localStorage)
// ------------------------------------------------------------------------------
/**
 * Saves the student records array to localStorage as JSON.
 * Wrapped in try...catch to handle storage quota errors or browser permission issues.
 * 
 * @param {Array} students - Array of student objects
 * @throws {Error} Throws error if saving to localStorage fails
 */
function saveStudents(students) {
  try {
    if (!Array.isArray(students)) {
      throw new TypeError('Invalid data format: Expected an array of students.');
    }
    const jsonString = JSON.stringify(students);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    throw new Error('Failed to save student record to storage: ' + error.message);
  }
}

// ------------------------------------------------------------------------------
// 5. Load Students from Browser Storage (localStorage)
// ------------------------------------------------------------------------------
/**
 * Reads and parses student records from localStorage.
 * Handles corrupted JSON or storage access errors gracefully with try...catch.
 * 
 * @returns {Array} Array of student records, or empty array if none or corrupted.
 */
function loadStudents() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    // If no data exists in localStorage yet, return empty list
    if (!rawData) {
      return [];
    }

    // Parse JSON
    const parsed = JSON.parse(rawData);

    // Verify parsed data is an array
    if (!Array.isArray(parsed)) {
      throw new Error('Stored data is corrupted (not an array).');
    }

    return parsed;
  } catch (error) {
    console.error('Exception caught while loading students:', error);
    // Display required assignment error message
    showMessage('An error occurred while loading student records.', 'error');
    // Return empty list so the app does not crash
    return [];
  }
}

// ------------------------------------------------------------------------------
// 6. Add Student (Form Submission Handler)
// ------------------------------------------------------------------------------
/**
 * Handles the "Add Student" form submission.
 * Enforces validation, checks for duplicate ID, saves record, and updates table.
 * 
 * @param {Event} event - The DOM submit event
 */
function addStudent(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  try {
    // 1. Gather raw form values
    const idInput = document.getElementById('studentId');
    const nameInput = document.getElementById('studentName');
    const ageInput = document.getElementById('studentAge');
    const emailInput = document.getElementById('studentEmail');
    const courseInput = document.getElementById('studentCourse');

    const formData = {
      idStr: idInput ? idInput.value.trim() : '',
      name: nameInput ? nameInput.value.trim() : '',
      ageStr: ageInput ? ageInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      course: courseInput ? courseInput.value : ''
    };

    // 2. Validate input using our exception-based validator
    validateForm(formData);

    // 3. Load existing students to check for duplicate IDs
    const currentStudents = loadStudents();
    const newStudentId = Number(formData.idStr);

    const isDuplicate = currentStudents.some(student => Number(student.id) === newStudentId);
    if (isDuplicate) {
      setFieldError('idError', 'Student ID already exists. Please use a different ID.', 'studentId');
      throw new Error('Student ID already exists. Please use a different ID.');
    }

    // 4. Construct student object according to assignment specifications:
    // { id: 101, name: "Sravya", age: 20, email: "sravya@gmail.com", course: "Computer Science" }
    const newStudent = {
      id: newStudentId,
      name: formData.name,
      age: Number(formData.ageStr),
      email: formData.email,
      course: formData.course
    };

    // 5. Append and save to localStorage
    currentStudents.push(newStudent);
    saveStudents(currentStudents);

    // 6. Reset form & inline error messages
    clearForm();

    // 7. Show success feedback
    showMessage('Student added successfully!', 'success');

    // 8. Refresh the table view and badges
    displayStudents();
    updateBadges();

    // Automatically navigate to Student Records view to see the newly added student
    switchTab('records');

  } catch (error) {
    console.warn('Form validation or processing exception:', error.message);
    showMessage(error.message, 'error');
  }
}

// ------------------------------------------------------------------------------
// 7. Display Students in HTML Table
// ------------------------------------------------------------------------------
/**
 * Renders the student list into the table.
 * If no students exist, displays "No student records found."
 * 
 * @param {Array|null} filteredList - Optional filtered array for search
 */
function displayStudents(filteredList = null) {
  try {
    const tableBody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('studentsTable');

    if (!tableBody) return;

    // Load students from storage if filtered list is not passed
    const students = filteredList !== null ? filteredList : loadStudents();

    // Clear existing table rows
    tableBody.innerHTML = '';

    if (!students || students.length === 0) {
      // Show empty state message
      if (emptyState) emptyState.classList.remove('hidden');
      if (table) table.style.display = 'none';
      return;
    }

    // Show table and hide empty state
    if (emptyState) emptyState.classList.add('hidden');
    if (table) table.style.display = 'table';

    // Populate table rows
    students.forEach((student) => {
      const row = document.createElement('tr');
      row.id = `student-row-${student.id}`;

      // Escape HTML helper to prevent XSS
      const safeId = escapeHtml(String(student.id));
      const safeName = escapeHtml(String(student.name));
      const safeAge = escapeHtml(String(student.age));
      const safeEmail = escapeHtml(String(student.email));
      const safeCourse = escapeHtml(String(student.course));

      row.innerHTML = `
        <td><span class="badge-id">${safeId}</span></td>
        <td><strong>${safeName}</strong></td>
        <td>${safeAge}</td>
        <td><a href="mailto:${safeEmail}" class="email-link" style="color: var(--primary); text-decoration: none;">${safeEmail}</a></td>
        <td><span class="badge-course">${safeCourse}</span></td>
        <td class="cell-action">
          <button 
            type="button" 
            class="btn-delete" 
            onclick="deleteStudent(${student.id})" 
            title="Delete student ${safeName}"
            aria-label="Delete student ${safeName}"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Delete</span>
          </button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Exception caught while displaying students:', error);
    showMessage('An error occurred while loading student records.', 'error');
  }
}

// ------------------------------------------------------------------------------
// 8. Delete Student
// ------------------------------------------------------------------------------
/**
 * Deletes a student by ID after asking confirmation.
 * Updates localStorage, refreshes the table, and displays a success message.
 * 
 * @param {number|string} studentId - ID of student to delete
 */
function deleteStudent(studentId) {
  try {
    const idToDelete = Number(studentId);
    if (isNaN(idToDelete) || idToDelete <= 0) {
      throw new Error('Invalid operation. Please try again.');
    }

    // Load current students
    const students = loadStudents();
    const targetStudent = students.find(s => Number(s.id) === idToDelete);

    if (!targetStudent) {
      throw new Error('Student record not found.');
    }

    // Confirmation dialog as required by the assignment
    const isConfirmed = window.confirm(`Are you sure you want to delete student "${targetStudent.name}" (ID: ${targetStudent.id})?`);
    if (!isConfirmed) {
      return; // User cancelled
    }

    // Filter out the student
    const updatedStudents = students.filter(s => Number(s.id) !== idToDelete);

    // Save updated list to localStorage
    saveStudents(updatedStudents);

    // Refresh table and badge counter
    displayStudents();
    updateBadges();

    // Display required assignment deletion success message
    showMessage('Student deleted successfully!', 'success');

  } catch (error) {
    console.error('Exception caught in deleteStudent:', error);
    showMessage(error.message || 'Invalid operation. Please try again.', 'error');
  }
}

// ------------------------------------------------------------------------------
// 9. Clear Form & Reset Validation States
// ------------------------------------------------------------------------------
/**
 * Clears all form fields and removes validation error highlights and messages.
 */
function clearForm() {
  const form = document.getElementById('studentForm');
  if (form) {
    form.reset();
  }
  clearFieldErrors();
}

/**
 * Removes all error messages and red border highlights from the form fields.
 */
function clearFieldErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => {
    el.textContent = '';
  });

  const inputs = document.querySelectorAll('.input-wrapper input, .input-wrapper select');
  inputs.forEach(input => {
    input.classList.remove('input-error');
  });
}

/**
 * Sets an error message on a specific field and highlights the input.
 * @param {string} elementId - ID of the error span
 * @param {string} message - Message text
 * @param {string} inputId - ID of the input element
 */
function setFieldError(elementId, message, inputId) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
  }
  if (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add('input-error');
    }
  }
}

// ------------------------------------------------------------------------------
// 10. Notification / Toast Messaging
// ------------------------------------------------------------------------------
/**
 * Displays top notification toast banner with appropriate styling and icon.
 * Automatically hides after 4 seconds.
 * 
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showMessage(message, type = 'info') {
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');

  if (!alertBox || !alertMessage) return;

  // Clear previous timeout
  if (alertDismissTimeout) {
    clearTimeout(alertDismissTimeout);
  }

  // Remove existing type classes
  alertBox.classList.remove('alert-success', 'alert-error', 'alert-info', 'hidden');

  // Set message text
  alertMessage.textContent = message;

  // Configure appearance based on message type
  if (type === 'success') {
    alertBox.classList.add('alert-success');
    alertIcon.innerHTML = '&#10003;'; // Checkmark
  } else if (type === 'error') {
    alertBox.classList.add('alert-error');
    alertIcon.innerHTML = '&#9888;'; // Warning sign
  } else {
    alertBox.classList.add('alert-info');
    alertIcon.innerHTML = '&#8505;'; // Info sign
  }

  // Auto-dismiss after 4.5 seconds
  alertDismissTimeout = setTimeout(() => {
    hideMessage();
  }, 4500);
}

/**
 * Hides the alert toast banner.
 */
function hideMessage() {
  const alertBox = document.getElementById('alertBox');
  if (alertBox) {
    alertBox.classList.add('hidden');
  }
}

// ------------------------------------------------------------------------------
// 11. Navigation / Tab Switching
// ------------------------------------------------------------------------------
/**
 * Switches between the "Add Student" and "Student Records" views.
 * @param {string} tabName - 'add' or 'records'
 */
function switchTab(tabName) {
  try {
    const tabAdd = document.getElementById('tabAddStudent');
    const tabRecords = document.getElementById('tabViewRecords');
    const secAdd = document.getElementById('sectionAddStudent');
    const secRecords = document.getElementById('sectionViewRecords');

    if (tabName === 'add') {
      tabAdd.classList.add('active');
      tabRecords.classList.remove('active');
      secAdd.classList.remove('hidden');
      secRecords.classList.add('hidden');
    } else if (tabName === 'records') {
      tabRecords.classList.add('active');
      tabAdd.classList.remove('active');
      secRecords.classList.remove('hidden');
      secAdd.classList.add('hidden');
      // Refresh students display when switching to records view
      displayStudents();
    } else {
      throw new Error('Invalid operation. Please try again.');
    }
  } catch (error) {
    console.error('Tab switch exception:', error);
    showMessage('Invalid operation. Please try again.', 'error');
  }
}

// ------------------------------------------------------------------------------
// 12. Helper Functions (Badge Count, Search, Demo Data, HTML Escaping)
// ------------------------------------------------------------------------------
/**
 * Updates total records count badge in the header and on navigation tab.
 */
function updateBadges() {
  try {
    const students = loadStudents();
    const count = students.length;

    const totalBadge = document.getElementById('totalRecordsBadge');
    const tabBadge = document.getElementById('tabCountBadge');

    if (totalBadge) totalBadge.textContent = count;
    if (tabBadge) tabBadge.textContent = count;
  } catch (error) {
    console.error('Badge update error:', error);
  }
}

/**
 * Live search filter for student records table.
 */
function handleSearch() {
  try {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const allStudents = loadStudents();

    if (!query) {
      displayStudents(allStudents);
      return;
    }

    const filtered = allStudents.filter(student => {
      const matchId = String(student.id).toLowerCase().includes(query);
      const matchName = String(student.name).toLowerCase().includes(query);
      const matchEmail = String(student.email).toLowerCase().includes(query);
      const matchCourse = String(student.course).toLowerCase().includes(query);
      return matchId || matchName || matchEmail || matchCourse;
    });

    displayStudents(filtered);
  } catch (error) {
    console.error('Search error:', error);
  }
}

/**
 * Clears all students from localStorage (with confirmation).
 */
function clearAllStudents() {
  try {
    const currentStudents = loadStudents();
    if (currentStudents.length === 0) {
      showMessage('No student records to clear.', 'info');
      return;
    }

    if (window.confirm('Are you sure you want to delete ALL student records? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      displayStudents();
      updateBadges();
      showMessage('All student records cleared successfully!', 'success');
    }
  } catch (error) {
    console.error('Clear all error:', error);
    showMessage('Invalid operation. Please try again.', 'error');
  }
}

/**
 * Fills example demo data into form fields for quick testing.
 */
function fillDemoData() {
  // Use unique ID based on current timestamp or next available ID
  const existing = loadStudents();
  let nextId = 101;
  while (existing.some(s => Number(s.id) === nextId)) {
    nextId++;
  }

  document.getElementById('studentId').value = nextId;
  document.getElementById('studentName').value = 'Sravya';
  document.getElementById('studentAge').value = '20';
  document.getElementById('studentEmail').value = 'sravya@gmail.com';
  document.getElementById('studentCourse').value = 'Computer Science';
  
  clearFieldErrors();
  showMessage('Demo student data loaded into form.', 'info');
}

/**
 * Helper to escape special HTML characters to prevent XSS injection.
 * @param {string} str 
 * @returns {string} Sanitized string
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Diagnostic helper to test JSON corruption exception handling per Assignment Requirement 7.
 * Injects invalid JSON into localStorage and re-triggers loadStudents().
 */
function testCorruptedData() {
  try {
    localStorage.setItem(STORAGE_KEY, '{invalid json syntax:');
    displayStudents();
  } catch (err) {
    console.error('Test corrupted data error:', err);
  }
}

