window.addEventListener('load', () => {
    const confirmLinks = document.querySelectorAll('.confirm-link');
    confirmLinks.forEach(l => {
        l.onclick = () => {
            return confirm('Are you sure?');
        };
    });
});