document.addEventListener('DOMContentLoaded', () => {
    const projectListView = document.getElementById('view-project-list');
    const projectCardLinks = document.querySelectorAll('.project-card-link');
    const backButtons = document.querySelectorAll('.back-button');

    // Function to show a specific project detail view
    function showDetailView(projectId) {
        // Hide the main project list (slides it to the left)
        projectListView.classList.add('view-hidden');
        projectListView.classList.remove('view-active');

        // Find and show the corresponding detail view (slides it in from the right)
        const detailView = document.getElementById(`view-${projectId}`);
        if (detailView) {
            detailView.classList.add('view-active');
        }
    }

    // Function to return to the main project list view
    function showProjectListView() {
        // Show the project list again (slides it in from the left)
        projectListView.classList.remove('view-hidden');
        projectListView.classList.add('view-active');

        // Hide all detail views (slides them to the right)
        document.querySelectorAll('.view-detail').forEach(view => {
            view.classList.remove('view-active');
        });
    }

    // Assign a click event to each project card
    projectCardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.dataset.project;
            showDetailView(projectId);
        });
    });

    // Assign a click event to all "Go Back" buttons
    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showProjectListView();
        });
    });
});