// Hamburger menu for mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Header shrink on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

// Smooth scroll for nav links
navItems.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
        navLinks.classList.remove('active'); // Close menu on mobile
    });
});

// Back to top button click
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form (demo only)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message!');
    this.reset();
});

// 3D Hero Background with Three.js
(function initHero3D() {
    const canvas = document.getElementById('bg3d');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Gradient background via fog for depth
    scene.fog = new THREE.Fog(0x0f172a, 6, 16);

    // Particles
    const particleCount = Math.min(900, Math.floor(window.innerWidth * 0.5));
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xed672d, size: 0.028, sizeAttenuation: true, transparent: true, opacity: 0.9 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle rotating wireframe sphere
    const sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.2, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.15, transparent: true })
    );
    sphere.position.z = -2;
    scene.add(sphere);

    // Mouse parallax
    const target = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        target.x = x * 0.6;
        target.y = -y * 0.4;
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animate
    let last = 0;
    function animate(ts) {
        const dt = (ts - last) / 1000;
        last = ts;
        sphere.rotation.y += 0.05 * dt;
        sphere.rotation.x += 0.015 * dt;

        camera.position.x += (target.x - camera.position.x) * 0.04;
        camera.position.y += (target.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        points.rotation.y += 0.01 * dt;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

// Tilt effect for cards (no external library)
(function initTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (!tiltElements.length) return;
    const maxTilt = 10;
    tiltElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const px = (x / rect.width) * 2 - 1;
            const py = (y / rect.height) * 2 - 1;
            const rx = (-py * maxTilt).toFixed(2);
            const ry = (px * maxTilt).toFixed(2);
            el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
})();

// Scroll reveal using IntersectionObserver
(function initReveal() {
    const revealEls = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window) || !revealEls.length) return;
    revealEls.forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(16px)';
    });
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 700ms ease, transform 700ms ease';
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
})();
