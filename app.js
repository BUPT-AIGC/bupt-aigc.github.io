function openFullscreen(video) {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { // Safari
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE11
        video.msRequestFullscreen();
    }
}

async function loadPartials() {
    const partialContainers = document.querySelectorAll('[data-partial]');

    for (const container of partialContainers) {
        const partialPath = container.getAttribute('data-partial');
        try {
            const response = await fetch(partialPath);
            if (!response.ok) {
                throw new Error(`Failed to load partial: ${partialPath}`);
            }
            container.outerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }
}

function initializeInteractions() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');

    function updateActiveLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 60) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('bg-yellow-400', 'text-gray-900');
            link.classList.add('text-gray-600');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('bg-yellow-400', 'text-gray-900');
                link.classList.remove('text-gray-600');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    initializeInteractions();
});
