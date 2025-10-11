// receivingReport.js
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Ẩn form khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    
});
