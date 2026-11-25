// JavaScript for Manager Software Dashboard

// Function to handle sidebar navigation
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const subMenuItems = document.querySelectorAll('.sub-menu-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const addButton = document.querySelector('.add-button');

    // Handle main menu items (only those without sub-menus)
    menuItems.forEach(item => {
        if (!item.classList.contains('has-sub-menu')) {
            item.addEventListener('click', () => {
                // Remove active class from all menu items
                menuItems.forEach(mi => mi.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');

                // Hide all pages
                pages.forEach(page => page.classList.remove('active'));

                // Show selected page
                const pageId = item.getAttribute('data-page');
                const selectedPage = document.getElementById(pageId);
                if (selectedPage) {
                    selectedPage.classList.add('active');
                if (pageId === 'performance') initPerformanceChart();
                    if (addButton) {
                        addButton.style.display = 'none';
                    }
                }

                // Update page title
                const pageName = item.querySelector('span').textContent;
                pageTitle.textContent = pageName;
            });
        }
    });

    // Handle sub-menu items
    subMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));

            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));

            // Show selected page
            const pageId = item.getAttribute('data-page');
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.add('active');
                if (addButton) {
                    addButton.style.display = 'none';
                }
                // Update page title
                const pageName = item.textContent.trim();
                pageTitle.textContent = pageName + ' Page';
            }
        });
    });
}

// Function to handle tab switching in hiring page
function initHiringTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show selected tab content
            const tabId = button.getAttribute('data-tab');
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        });
    });
}

function initPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    const chartLibrary = window.Chart;
    if (!canvas || canvas.dataset.chartInitialized === 'true' || typeof chartLibrary !== 'function') return;

    const context = canvas.getContext('2d');
    if (!context) return;

    new chartLibrary(context, {
        type: 'bar',
        data: {
            labels: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'],
            datasets: [{
                label: 'Performance Score',
                data: [85, 92, 78, 88, 95],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Employee Performance Scores'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    canvas.dataset.chartInitialized = 'true';
}

// Function to handle Create Job Requirement form
function initCreateJobForm() {
    const greenBtn = document.getElementById('green-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const jobForm = document.getElementById('job-requirement-form');
    const createJobForm = document.getElementById('create-job-form');
    const hiringContainer = document.querySelector('.hiring-container');
    const existingTab = document.getElementById('existing-tab');
    const existingTabBtn = document.querySelector('[data-tab="existing-tab"]');

    // Show form on green button click
    greenBtn.addEventListener('click', () => {
        hiringContainer.style.display = 'none';
        createJobForm.style.display = 'block';
    });

    // Hide form and show existing employees on cancel
    cancelBtn.addEventListener('click', () => {
        createJobForm.style.display = 'none';
        hiringContainer.style.display = 'block';
        // Ensure existing tab is active
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        existingTabBtn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        existingTab.classList.add('active');
    });

    // Form submission with validation
    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const requiredFields = jobForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#ced4da';
            }
        });

        if (isValid) {
            // Simulate submission (since no backend)
            alert('Job requirement submitted to Head Office successfully!');
            // Reset form and go back
            jobForm.reset();
            createJobForm.style.display = 'none';
            hiringContainer.style.display = 'block';
            // Ensure existing tab is active
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            existingTabBtn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            existingTab.classList.add('active');
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHiringTabs();
    initCreateJobForm();

    // Handle sidebar title click to show dashboard
    const sidebarTitle = document.getElementById('sidebar-title');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const menuItems = document.querySelectorAll('.menu-item');
    const addButton = document.querySelector('.add-button');

    sidebarTitle.addEventListener('click', () => {
        // Remove active class from all menu items
        menuItems.forEach(mi => mi.classList.remove('active'));

        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));

        // Return to the HR landing page
        const hiringPage = document.getElementById('hiring');
        if (hiringPage) hiringPage.classList.add('active');

        // Update page title
        pageTitle.textContent = 'Hiring';
    });
});
