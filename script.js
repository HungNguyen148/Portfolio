document.addEventListener('DOMContentLoaded', () => {
    const projectListView = document.getElementById('view-project-list');
    const projectCardLinks = document.querySelectorAll('.project-card-link');
    const backButtons = document.querySelectorAll('.back-button');

    // Hàm hiển thị một view chi tiết
    function showDetailView(projectId) {
        // Ẩn view danh sách dự án (trượt sang trái)
        projectListView.classList.add('view-hidden');
        projectListView.classList.remove('view-active');

        // Tìm và hiển thị view chi tiết tương ứng (trượt vào từ phải)
        const detailView = document.getElementById(`view-${projectId}`);
        if (detailView) {
            detailView.classList.add('view-active');
        }
    }

    // Hàm quay lại view danh sách dự án
    function showProjectListView() {
        // Hiện lại view danh sách (trượt vào từ trái)
        projectListView.classList.remove('view-hidden');
        projectListView.classList.add('view-active');

        // Ẩn tất cả các view chi tiết (trượt sang phải)
        document.querySelectorAll('.view-detail').forEach(view => {
            view.classList.remove('view-active');
        });
    }

    // Gán sự kiện click cho mỗi thẻ dự án
    projectCardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.dataset.project;
            showDetailView(projectId);
        });
    });

    // Gán sự kiện click cho tất cả các nút "Go Back"
    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showProjectListView();
        });
    });
});