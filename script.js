document.addEventListener('DOMContentLoaded', () => {
    const projectListView = document.getElementById('view-project-list');
    const projectCardLinks = document.querySelectorAll('.project-card-link');
    const backButtons = document.querySelectorAll('.back-button');

    // Modal handling
    const modal = document.getElementById('cv-modal');
    const resumeButton = document.querySelector('.resume-button');
    const closeModal = document.querySelector('.close-modal');

    // Show modal when clicking resume button
    resumeButton.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Function to show a specific project detail view
    function showDetailView(projectId) {
        // Hide the main project list (slides it to the left)
        projectListView.classList.add('view-hidden');
        projectListView.classList.remove('view-active');

        // Find and show the corresponding detail view (slides it in from the right)
        const detailView = document.getElementById(`view-${projectId}`);
        if (detailView) {
            detailView.classList.add('view-active');
            
            // Reset media display to first item
            const firstThumb = detailView.querySelector('.media-thumbnail');
            if (firstThumb) {
                firstThumb.click();
            }
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

    // Handle media thumbnails for each project view separately
    document.querySelectorAll('.view-detail').forEach(projectView => {
        const thumbnails = projectView.querySelectorAll('.media-thumbnail');
        const mainContainer = projectView.querySelector('.media-main');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all thumbnails in this project view
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                thumb.classList.add('active');

                // Get the type and source from the thumbnail
                const type = thumb.dataset.type;
                const src = thumb.dataset.src;

                // Create the appropriate content based on type
                let content;
                if (type === 'video') {
                    content = `
                        <div class="media-item active" data-type="video" data-src="${src}">
                            <iframe 
                                src="${src}" 
                                title="Project Video"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>`;
                } else {
                    content = `
                        <div class="media-item active" data-type="image" data-src="${src}">
                            <img src="${src}" alt="Project Media">
                        </div>`;
                }

                // Update the main container content
                mainContainer.innerHTML = content;
            });
        });

        // Initialize with the first thumbnail active
        const firstThumb = thumbnails[0];
        if (firstThumb) {
            firstThumb.click();
        }
    });
});