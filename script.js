document.addEventListener('DOMContentLoaded', () => {
    // --- Fade-in sections ---
    const fadeInSections = document.querySelectorAll('#projects, #education, #technical-experience, #contact');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeInSections.forEach(section => {
        section.classList.add('fade-in-section');
        fadeInObserver.observe(section);
    });

    // --- CV modal ---
    const modal = document.getElementById('cv-modal');
    const resumeButton = document.querySelector('.resume-button');
    const closeModalButton = modal.querySelector('.close-modal');
    const cvFrame = modal.querySelector('.cv-frame');

    function openModal() {
        // Only download the PDF the first time someone actually opens the resume
        if (!cvFrame.src) {
            cvFrame.src = cvFrame.dataset.src;
        }
        modal.hidden = false;
        document.querySelector('.portfolio-container').inert = true;
        closeModalButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.querySelector('.portfolio-container').inert = false;
        resumeButton.focus();
    }

    resumeButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });

    // --- Project detail media ---
    function showMedia(projectView, thumb) {
        projectView.querySelectorAll('.media-thumbnail').forEach(t => {
            t.classList.toggle('active', t === thumb);
            t.setAttribute('aria-pressed', String(t === thumb));
        });

        const mainContainer = projectView.querySelector('.media-main');
        const { type, src } = thumb.dataset;
        const title = thumb.dataset.title || thumb.querySelector('img').alt;

        let media;
        if (type === 'video') {
            media = document.createElement('iframe');
            media.src = src;
            // YouTube refuses to play embeds that arrive without a referrer (error 153)
            media.referrerPolicy = 'strict-origin-when-cross-origin';
            media.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            media.allowFullscreen = true;
        } else {
            media = document.createElement('img');
            media.src = src;
            media.alt = title;
        }
        media.title = title;
        mainContainer.replaceChildren(media);
    }

    // Removing the iframe is the only reliable way to stop a YouTube video that is still playing
    function clearMedia(projectView) {
        projectView.querySelector('.media-main').replaceChildren();
    }

    document.querySelectorAll('.view-detail').forEach(projectView => {
        projectView.querySelectorAll('.media-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => showMedia(projectView, thumb));
        });
    });

    // --- Views & routing (#project-id in the URL opens that project) ---
    const projectListView = document.getElementById('view-project-list');
    const detailViews = document.querySelectorAll('.view-detail');

    function setViewActive(view, isActive) {
        view.classList.toggle('view-active', isActive);
        view.inert = !isActive;
    }

    // moveFocus is false on first load so a deep link doesn't show a focus ring nobody asked for
    function route(moveFocus = true) {
        const projectId = location.hash.slice(1);
        const detailView = projectId ? document.getElementById(`view-${projectId}`) : null;
        let closedView = null;

        detailViews.forEach(view => {
            if (view !== detailView && view.classList.contains('view-active')) {
                setViewActive(view, false);
                clearMedia(view);
                closedView = view;
            }
        });

        if (detailView) {
            projectListView.classList.add('view-hidden');
            setViewActive(projectListView, false);

            if (!detailView.classList.contains('view-active')) {
                setViewActive(detailView, true);
                detailView.scrollTop = 0;
                showMedia(detailView, detailView.querySelector('.media-thumbnail'));
                if (moveFocus) {
                    detailView.querySelector('.back-button').focus({ preventScroll: true });
                }
            }
        } else {
            projectListView.classList.remove('view-hidden');
            setViewActive(projectListView, true);

            // Return keyboard focus to the card the visitor came from
            if (closedView) {
                const cardLink = projectListView.querySelector(`.project-card-link[href="#${closedView.id.replace('view-', '')}"]`);
                if (cardLink) {
                    cardLink.focus({ preventScroll: true });
                }
            }
        }
    }

    // "Go Back" uses browser history when possible so the Back button and the link stay in sync
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (history.state && history.state.fromList) {
                history.back();
            } else {
                history.pushState(null, '', location.pathname + location.search);
                route();
            }
        });
    });

    document.querySelectorAll('.project-card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState({ fromList: true }, '', link.getAttribute('href'));
            route();
        });
    });

    window.addEventListener('popstate', () => route());
    route(false);
});
