// My Courses Page JavaScript

// Course data
const courseData = {
    'web-development': {
        id: 'web-development',
        title: 'Web Development Fundamentals',
        icon: '💻',
        progress: 0,
        lessons: [
            { id: 1, title: 'Introduction to HTML', duration: '30 min', completed: false },
            { id: 2, title: 'HTML Elements and Structure', duration: '45 min', completed: false },
            { id: 3, title: 'CSS Basics', duration: '40 min', completed: false },
            { id: 4, title: 'CSS Layouts and Flexbox', duration: '50 min', completed: false },
            { id: 5, title: 'JavaScript Fundamentals', duration: '60 min', completed: false }
        ]
    },
    'react-mastery': {
        id: 'react-mastery',
        title: 'React Mastery',
        icon: '⚛️',
        progress: 0,
        lessons: [
            { id: 1, title: 'React Basics and JSX', duration: '45 min', completed: false },
            { id: 2, title: 'Components and Props', duration: '50 min', completed: false },
            { id: 3, title: 'State and Lifecycle', duration: '55 min', completed: false },
            { id: 4, title: 'Hooks in React', duration: '60 min', completed: false },
            { id: 5, title: 'React Router', duration: '40 min', completed: false }
        ]
    },
    'node-backend': {
        id: 'node-backend',
        title: 'Node.js Backend Development',
        icon: '🚀',
        progress: 0,
        lessons: [
            { id: 1, title: 'Node.js Fundamentals', duration: '40 min', completed: false },
            { id: 2, title: 'Express.js Framework', duration: '50 min', completed: false },
            { id: 3, title: 'RESTful API Design', duration: '45 min', completed: false },
            { id: 4, title: 'Database Integration', duration: '60 min', completed: false },
            { id: 5, title: 'Authentication & Security', duration: '55 min', completed: false }
        ]
    },
    'auth0-security': {
        id: 'auth0-security',
        title: 'Auth0 & Application Security',
        icon: '🔐',
        progress: 0,
        lessons: [
            { id: 1, title: 'Introduction to Auth0', duration: '30 min', completed: false },
            { id: 2, title: 'OAuth 2.0 and OpenID Connect', duration: '45 min', completed: false },
            { id: 3, title: 'Implementing Auth0 in Web Apps', duration: '50 min', completed: false },
            { id: 4, title: 'Multi-Factor Authentication', duration: '40 min', completed: false },
            { id: 5, title: 'Security Best Practices', duration: '35 min', completed: false }
        ]
    }
};

// Load user's enrolled courses
async function loadMyCourses() {
    const loadingState = document.getElementById('loadingState');
    const noAccessState = document.getElementById('noAccessState');
    const enrolledCoursesContainer = document.getElementById('enrolledCourses');

    try {
        // Check authentication
        const authResponse = await fetch('/api/auth/status');
        const authData = await authResponse.json();

        if (!authData.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        // Get user's course access from claims
        const namespace = 'https://verceltestapp-five.vercel.app';
        const user = authData.user;
        const courseAccess = user[`${namespace}/courses`] || [];

        loadingState.style.display = 'none';

        if (courseAccess.length === 0) {
            noAccessState.style.display = 'block';
            return;
        }

        // Display enrolled courses
        enrolledCoursesContainer.style.display = 'block';
        enrolledCoursesContainer.innerHTML = courseAccess.map(courseId => {
            const course = courseData[courseId];
            if (!course) return '';

            return `
                <div class="enrolled-course-card">
                    <div class="course-header">
                        <div class="course-icon-large">${course.icon}</div>
                        <div class="course-info">
                            <h2>${course.title}</h2>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${course.progress}%"></div>
                            </div>
                            <p class="progress-text">${course.progress}% Complete</p>
                        </div>
                    </div>
                    <div class="course-lessons">
                        <h3>Course Content</h3>
                        <ul class="lessons-list">
                            ${course.lessons.map(lesson => `
                                <li class="lesson-item ${lesson.completed ? 'completed' : ''}">
                                    <span class="lesson-checkbox">${lesson.completed ? '✓' : ''}</span>
                                    <span class="lesson-title">${lesson.title}</span>
                                    <span class="lesson-duration">${lesson.duration}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="continueCourse('${course.id}')">
                        ${course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </button>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading courses:', error);
        loadingState.style.display = 'none';
        noAccessState.style.display = 'block';
    }
}

// Continue course function
function continueCourse(courseId) {
    alert(`Starting course: ${courseData[courseId].title}\n\nThis would navigate to the course player.`);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadMyCourses();
});
