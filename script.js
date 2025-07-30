// Global variables
let currentUser = null;
let currentWeek = new Date();
let dashboardData = {};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadUserData();
    setCurrentDate();
});

// Initialize dashboard
function initializeDashboard() {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserInfo();
    } else {
        // Simulate login for demo
        currentUser = {
            id: 'STU001',
            name: 'Alex Johnson',
            email: 'alex.johnson@vit.edu',
            class: 'Computer Science - Year 2'
        };
        localStorage.setItem('userData', JSON.stringify(currentUser));
        updateUserInfo();
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up progress circles
    setupProgressCircles();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTasks(btn.dataset.filter);
        });
    });
    
    // Settings form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleTheme);
    }
    
    // Date picker
    const datePicker = document.getElementById('date-picker');
    if (datePicker) {
        datePicker.addEventListener('change', handleDateChange);
    }
}

// Navigation
function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        classes: 'My Classes',
        tasks: 'Tasks',
        timetable: 'Timetable',
        grades: 'Grades',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[page];
    
    // Load page-specific data
    loadPageData(page);
}

// Load page-specific data
function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'classes':
            loadClassesData();
            break;
        case 'tasks':
            loadTasksData();
            break;
        case 'timetable':
            loadTimetableData();
            break;
        case 'grades':
            loadGradesData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Dashboard data loading
function loadDashboardData() {
    // Simulate API call
    dashboardData = {
        stats: {
            totalClasses: 24,
            completedTasks: 18,
            pendingTasks: 6,
            attendanceRate: 85
        },
        recentTasks: [
            {
                id: 1,
                subject: 'Mathematics',
                task: 'Calculus Assignment',
                dueDate: '2025-08-02',
                status: 'pending',
                priority: 'high'
            },
            {
                id: 2,
                subject: 'Physics',
                task: 'Lab Report - Mechanics',
                dueDate: '2025-08-01',
                status: 'completed',
                priority: 'medium'
            },
            {
                id: 3,
                subject: 'Chemistry',
                task: 'Organic Chemistry Quiz',
                dueDate: '2025-08-03',
                status: 'pending',
                priority: 'high'
            },
            {
                id: 4,
                subject: 'English',
                task: 'Essay on Modern Literature',
                dueDate: '2025-08-05',
                status: 'in-progress',
                priority: 'low'
            }
        ],
        recentUpdates: [
            {
                id: 1,
                user: 'Dr. Smith',
                action: 'assigned new task',
                subject: 'Mathematics',
                time: '2 hours ago'
            },
            {
                id: 2,
                user: 'Prof. Johnson',
                action: 'updated grade for',
                subject: 'Physics Lab',
                time: '4 hours ago'
            },
            {
                id: 3,
                user: 'Admin',
                action: 'scheduled class for',
                subject: 'Chemistry',
                time: '1 day ago'
            }
        ],
        todaySchedule: [
            {
                time: '09:00 AM',
                subject: 'Mathematics',
                room: 'Room 201',
                type: 'Lecture'
            },
            {
                time: '11:00 AM',
                subject: 'Physics Lab',
                room: 'Lab 305',
                type: 'Practical'
            },
            {
                time: '02:00 PM',
                subject: 'Chemistry',
                room: 'Room 102',
                type: 'Lecture'
            }
        ]
    };
    
    updateDashboardUI();
}

// Update dashboard UI
function updateDashboardUI() {
    // Update stats
    document.getElementById('total-classes').textContent = dashboardData.stats.totalClasses;
    document.getElementById('completed-tasks').textContent = dashboardData.stats.completedTasks;
    document.getElementById('attendance-rate').textContent = dashboardData.stats.attendanceRate + '%';
    document.getElementById('task-count').textContent = dashboardData.stats.pendingTasks;
    
    // Update recent tasks table
    const tasksContainer = document.getElementById('recent-tasks');
    tasksContainer.innerHTML = '';
    
    dashboardData.recentTasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.subject}</td>
            <td>${task.task}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="status-badge status-${task.status}">${task.status}</span></td>
            <td><button class="action-btn" onclick="viewTask(${task.id})">Details</button></td>
        `;
        tasksContainer.appendChild(row);
    });
    
    // Update recent updates
    const updatesContainer = document.getElementById('recent-updates');
    updatesContainer.innerHTML = '';
    
    dashboardData.recentUpdates.forEach(update => {
        const updateDiv = document.createElement('div');
        updateDiv.className = 'update-item';
        updateDiv.innerHTML = `
            <div class="update-avatar">${update.user.charAt(0)}</div>
            <div class="update-content">
                <div class="update-text">
                    <strong>${update.user}</strong> ${update.action} <strong>${update.subject}</strong>
                </div>
                <div class="update-time">${update.time}</div>
            </div>
        `;
        updatesContainer.appendChild(updateDiv);
    });
    
    // Update today's schedule
    const scheduleContainer = document.getElementById('today-schedule');
    scheduleContainer.innerHTML = '';
    
    dashboardData.todaySchedule.forEach(item => {
        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule-item';
        scheduleDiv.innerHTML = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <div class="schedule-subject">${item.subject}</div>
                <div class="schedule-room">${item.room} - ${item.type}</div>
            </div>
        `;
        scheduleContainer.appendChild(scheduleDiv);
    });
}

// Load classes data
function loadClassesData() {
    const classes = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            code: 'MATH301',
            instructor: 'Dr. Sarah Smith',
            credits: 4,
            attendance: 92,
            assignments: 8,
            grade: 'A-'
        },
        {
            id: 2,
            title: 'Physics Laboratory',
            code: 'PHYS205',
            instructor: 'Prof. John Johnson',
            credits: 3,
            attendance: 88,
            assignments: 12,
            grade: 'B+'
        },
        {
            id: 3,
            title: 'Organic Chemistry',
            code: 'CHEM202',
            instructor: 'Dr. Emily Brown',
            credits: 4,
            attendance: 95,
            assignments: 6,
            grade: 'A'
        },
        {
            id: 4,
            title: 'English Literature',
            code: 'ENG101',
            instructor: 'Prof. Michael Davis',
            credits: 3,
            attendance: 90,
            assignments: 10,
            grade: 'B'
        }
    ];
    
    const classesGrid = document.getElementById('classes-grid');
    classesGrid.innerHTML = '';
    
    classes.forEach(cls => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        classCard.innerHTML = `
            <div class="class-header">
                <div>
                    <div class="class-title">${cls.title}</div>
                    <div class="class-code">${cls.code}</div>
                </div>
            </div>
            <div class="class-instructor">Instructor: ${cls.instructor}</div>
            <div class="class-stats">
                <div class="class-stat">
                    <div class="class-stat-value">${cls.credits}</div>
                    <div class="class-stat-label">Credits</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${cls.attendance}%</div>
                    <div class="class-stat-label">Attendance</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${cls.assignments}</div>
                    <div class="class-stat-label">Assignments</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${cls.grade}</div>
                    <div class="class-stat-label">Grade</div>
                </div>
            </div>
        `;
        classesGrid.appendChild(classCard);
    });
}

// Load tasks data
function loadTasksData() {
    const tasks = [
        {
            id: 1,
            subject: 'Mathematics',
            title: 'Calculus Assignment',
            description: 'Complete exercises 1-15 from Chapter 8, focusing on integration by parts.',
            dueDate: '2025-08-02',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 2,
            subject: 'Physics',
            title: 'Lab Report - Mechanics',
            description: 'Write a comprehensive report on the pendulum experiment conducted last week.',
            dueDate: '2025-08-01',
            status: 'completed',
            priority: 'medium'
        },
        {
            id: 3,
            subject: 'Chemistry',
            title: 'Organic Chemistry Quiz',
            description: 'Prepare for quiz covering alkenes, alkynes, and aromatic compounds.',
            dueDate: '2025-08-03',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 4,
            subject: 'English',
            title: 'Essay on Modern Literature',
            description: 'Write a 1500-word essay analyzing themes in contemporary fiction.',
            dueDate: '2025-08-05',
            status: 'in-progress',
            priority: 'low'
        },
        {
            id: 5,
            subject: 'Mathematics',
            title: 'Geometry Problem Set',
            description: 'Solve problems related to coordinate geometry and transformations.',
            dueDate: '2025-07-28',
            status: 'overdue',
            priority: 'high'
        }
    ];
    
    displayTasks(tasks);
}

// Display tasks
function displayTasks(tasks) {
    const tasksContainer = document.getElementById('all-tasks');
    tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.priority}-priority`;
        taskDiv.innerHTML = `
            <div class="task-header">
                <div>
                    <div class="task-title">${task.title}</div>
                    <div class="task-subject">${task.subject}</div>
                </div>
                <div>
                    <div class="task-due">Due: ${formatDate(task.dueDate)}</div>
                    <span class="status-badge status-${task.status}">${task.status}</span>
                </div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-actions">
                ${task.status !== 'completed' ? '<button class="task-btn btn-complete" onclick="completeTask(' + task.id + ')">Complete</button>' : ''}
                <button class="task-btn btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="task-btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(taskDiv);
    });
}

// Filter tasks
function filterTasks(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter tasks (would normally call API)
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach(task => {
        const status = task.querySelector('.status-badge').textContent.trim();
        if (filter === 'all' || status === filter) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

// Load timetable data
function loadTimetableData() {
    const timetable = {
        timeSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        schedule: {
            'Monday': {
                '09:00': 'Mathematics',
                '10:00': 'Physics',
                '11:00': 'Break',
                '12:00': 'Chemistry',
                '13:00': 'Lunch',
                '14:00': 'English',
                '15:00': 'Lab',
                '16:00': ''
            },
            'Tuesday': {
                '09:00': 'Physics',
                '10:00': 'Mathematics',
                '11:00': 'Break',
                '12:00': 'English',
                '13:00': 'Lunch',
                '14:00': 'Chemistry',
                '15:00': 'Lab',
                '16:00': ''
            },
            // Add more days...
        }
    };
    
    const timetableGrid = document.getElementById('timetable-grid');
    timetableGrid.innerHTML = '';
    
    // Header row
    timetableGrid.appendChild(createTimetableCell('', 'time-slot'));
    timetable.days.forEach(day => {
        timetableGrid.appendChild(createTimetableCell(day, 'day-header'));
    });
    
    // Time slots
    timetable.timeSlots.forEach(time => {
        timetableGrid.appendChild(createTimetableCell(time, 'time-slot'));
        timetable.days.forEach(day => {
            const subject = timetable.schedule[day] ? timetable.schedule[day][time] || '' : '';
            const cellClass = subject === 'Break' || subject === 'Lunch' ? 'class-slot break' : 'class-slot';
            timetableGrid.appendChild(createTimetableCell(subject, cellClass));
        });
    });
}

// Create timetable cell
function createTimetableCell(content, className) {
    const cell = document.createElement('div');
    cell.className = className;
    cell.textContent = content;
    return cell;
}

// Load grades data
function loadGradesData() {
    const grades = [
        {
            subject: 'Mathematics',
            assignment: 'Midterm Exam',
            grade: 'A',
            points: '95/100',
            date: '2025-07-15'
        },
        {
            subject: 'Physics',
            assignment: 'Lab Report 1',
            grade: 'B+',
            points: '87/100',
            date: '2025-07-20'
        },
        {
            subject: 'Chemistry',
            assignment: 'Quiz 3',
            grade: 'A-',
            points: '91/100',
            date: '2025-07-25'
        },
        {
            subject: 'English',
            assignment: 'Essay Assignment',
            grade: 'B',
            points: '83/100',
            date: '2025-07-22'
        }
    ];
    
    const gradesContainer = document.getElementById('grades-list');
    gradesContainer.innerHTML = '';
    
    grades.forEach(grade => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.subject}</td>
            <td>${grade.assignment}</td>
            <td><span class="grade-value grade-${grade.grade.charAt(0).toLowerCase()}">${grade.grade}</span></td>
            <td>${grade.points}</td>
            <td>${formatDate(grade.date)}</td>
        `;
        gradesContainer.appendChild(row);
    });
}

// Load settings data
function loadSettingsData() {
    if (currentUser) {
        document.getElementById('profile-name').value = currentUser.name;
        document.getElementById('profile-email').value = currentUser.email;
        document.getElementById('profile-id').value = currentUser.id;
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-picker').value = today;
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('student-name').textContent = currentUser.name;
    }
}

function setupProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const progress = circle.dataset.progress;
        const degree = (progress / 100) * 360;
        circle.style.background = `conic-gradient(var(--primary-color) ${degree}deg, var(--border-color) ${degree}deg)`;
    });
}

// Event handlers
function handleDateChange(event) {
    const selectedDate = event.target.value;
    // Update dashboard data based on selected date
    loadDashboardData();
    showToast('Date updated successfully', 'success');
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const updatedUser = {
        ...currentUser,
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value
    };
    
    // Simulate API call
    setTimeout(() => {
        currentUser = updatedUser;
        localStorage.setItem('userData', JSON.stringify(currentUser));
        updateUserInfo();
        showToast('Profile updated successfully', 'success');
    }, 1000);
}

// Task actions
function viewTask(taskId) {
    showToast(`Viewing task ${taskId}`, 'info');
    // Would normally open a modal or navigate to task details
}

function completeTask(taskId) {
    showToast(`Task ${taskId} marked as completed`, 'success');
    // Update task status in backend
    setTimeout(() => {
        loadTasksData();
        loadDashboardData();
    }, 500);
}

function editTask(taskId) {
    showToast(`Editing task ${taskId}`, 'info');
    // Would normally open edit modal
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        showToast(`Task ${taskId} deleted`, 'success');
        // Delete task from backend
        setTimeout(() => {
            loadTasksData();
            loadDashboardData();
        }, 500);
    }
}

// Theme functions
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme on load
function initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle i').className = 'fas fa-sun';
        document.getElementById('dark-mode-toggle').checked = true;
    }
}

// Week navigation for timetable
function previousWeek() {
    const currentWeekEl = document.getElementById('current-week');
    currentWeek.setDate(currentWeek.getDate() - 7);
    currentWeekEl.textContent = `Week of ${currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    loadTimetableData();
}

function nextWeek() {
    const currentWeekEl = document.getElementById('current-week');
    currentWeek.setDate(currentWeek.getDate() + 7);
    currentWeekEl.textContent = `Week of ${currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    loadTimetableData();
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('darkMode');
        showToast('Logged out successfully', 'success');
        
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// API simulation functions
async function fetchData(endpoint) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data based on endpoint
    switch(endpoint) {
        case '/api/dashboard':
            return dashboardData;
        case '/api/classes':
            return mockClasses;
        case '/api/tasks':
            return mockTasks;
        case '/api/timetable':
            return mockTimetable;
        case '/api/grades':
            return mockGrades;
        default:
            throw new Error('Endpoint not found');
    }
}

async function postData(endpoint, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful response
    return { success: true, message: 'Data updated successfully' };
}

// Real-time updates simulation
function startRealTimeUpdates() {
    // Simulate receiving updates every 30 seconds
    setInterval(() => {
        // Check for new notifications, tasks, etc.
        checkForUpdates();
    }, 30000);
}

function checkForUpdates() {
    // Simulate random updates
    const updates = [
        'New assignment posted in Mathematics',
        'Grade updated for Physics Lab',
        'Reminder: Chemistry quiz tomorrow',
        'Class schedule updated'
    ];
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    
    // Only show if user is active (not idle)
    if (document.visibilityState === 'visible') {
        showToast(randomUpdate, 'info');
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.className = 'search-input';
    
    const headerLeft = document.querySelector('.header-left');
    headerLeft.appendChild(searchInput);
    
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    // Search through current page content
    const currentPage = document.querySelector('.page.active');
    const searchableElements = currentPage.querySelectorAll('[data-searchable]');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const parent = element.closest('.task-item, .class-card, .update-item');
        
        if (parent) {
            if (text.includes(query) || query === '') {
                parent.style.display = 'block';
            } else {
                parent.style.display = 'none';
            }
        }
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Only handle shortcuts when not in input fields
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            switch(event.key) {
                case '1':
                    navigateToPage('dashboard');
                    break;
                case '2':
                    navigateToPage('classes');
                    break;
                case '3':
                    navigateToPage('tasks');
                    break;
                case '4':
                    navigateToPage('timetable');
                    break;
                case '5':
                    navigateToPage('grades');
                    break;
                case '6':
                    navigateToPage('settings');
                    break;
                case 't':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        toggleTheme();
                    }
                    break;
            }
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('.header');
    header.insertBefore(menuToggle, header.firstChild);
    
    menuToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Responsive handling
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        setupMobileMenu();
    }
}

// Initialize everything when page loads
function initializeApp() {
    initializeDashboard();
    initializeTheme();
    setupKeyboardShortcuts();
    startRealTimeUpdates();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    handleResize();
}

// Call initialization
initializeApp();

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    showInstallPrompt();
});

function showInstallPrompt() {
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install App';
    installBtn.className = 'install-btn';
    
    document.body.appendChild(installBtn);
    
    installBtn.addEventListener('click', () => {
        // Hide the install button
        installBtn.style.display = 'none';
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// Online/offline status
window.addEventListener('online', () => {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    showToast('You are currently offline', 'warning');
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            if (loadTime > 3000) {
                console.warn('Slow page load detected');
            }
        });
    }
}

measurePerformance();