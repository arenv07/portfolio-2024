const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector("header");
const navLinks = document.querySelector("header ul");

function openMenu() {
    sideMenu.style.transform = 'translateX(-16rem)';
}
function closeMenu() {
    sideMenu.style.transform = 'translateX(16rem)';
}

window.addEventListener('scroll', ()=>{
    if(scrollY > 50){
        navBar.classList.add('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm')
    } else {
        navBar.classList.remove('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm')
    }
})

// HIDE SCROLL FOR MORE ON USER SCROLL
// Get the scroll indicator element
const scrollIndicator = document.querySelector('.scroll-indicator');

// Add scroll event listener to hide/show scroll indicator
window.addEventListener('scroll', () => {
  // Get current scroll position
  const scrollPosition = window.scrollY;
  
  // If user has scrolled more than 100px, hide the indicator
  if (scrollPosition > 100) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.pointerEvents = 'none'; // Prevent interaction while invisible
  } else {
    scrollIndicator.style.opacity = '1';
    scrollIndicator.style.pointerEvents = 'auto';
  }
});

// Add this CSS to your style section
const style = document.createElement('style');
style.textContent = `
  .scroll-indicator {
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);








// Utility functions
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Clear form function
  window.clearFields = function() {
    setTimeout(() => {
      document.querySelector('input[name="name"]').value = '';
      document.querySelector('input[name="email"]').value = '';
      document.querySelector('textarea[name="message"]').value = '';
    }, 500);
  };

  // Mobile menu functions
  window.openMenu = function() {
    document.getElementById('sideMenu').style.right = '0';
  };

  window.closeMenu = function() {
    document.getElementById('sideMenu').style.right = '-16rem';
  };

  // Initialize Lenis
  const lenis = new Lenis({
    wrapper: window,
    content: document.documentElement,
    smooth: true,
    lerp: 0.05
  });

  // Optimize scroll handling with event delegation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, {
          offset: -100,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  });

  // Progress bar and rocket optimization
  const progressBar = document.querySelector('.progress-bar');
  const rocket = document.querySelector('#rocket');
  
  const updateProgressBar = throttle((scrollProgress) => {
    if (!progressBar || !rocket) return;
    
    const scrollPercentage = scrollProgress * 100;
    progressBar.style.width = `${scrollPercentage}%`;
    rocket.style.transform = `translateX(${(scrollPercentage / 100) * (window.innerWidth - rocket.offsetWidth)}px)`;
  }, 16);

  // Lenis scroll loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Throttled scroll handler
  lenis.on('scroll', ({ progress }) => {
    planeMaterial.uniforms.uScroll.value = progress;
    updateProgressBar(progress);
  });

  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create materials and geometries
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScroll: { value: 0 },
      uColors: {
        value: [
          new THREE.Color(0xFAF9F6),
          new THREE.Color(0xD8D8D8),
          new THREE.Color(0xCACACA),
          new THREE.Color(0xBABABA)
        ]
      }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uScroll;
      uniform vec3 uColors[4];
      varying vec2 vUv;
      
      void main() {
        float scrollSection = floor(uScroll * 3.0);
        float t = fract(uScroll * 3.0);
        vec3 color1 = uColors[int(scrollSection)];
        vec3 color2 = uColors[int(min(scrollSection + 1.0, 3.0))];
        vec3 finalColor = mix(color1, color2, t);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    depthWrite: false
  });

  const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  backgroundPlane.material.side = THREE.DoubleSide;
  backgroundPlane.position.z = -1;
  scene.add(backgroundPlane);

  // Optimize particle system
  const particles = 250;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particles * 3);

  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 800;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x28282B,
    size: 1.3,
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  camera.position.z = 500;

  // Three.js animation loop
  function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0005;
    particleSystem.rotation.x += 0.00025;
    renderer.render(scene, camera);
  }

  // Optimized resize handler
  const handleResize = debounce(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateProgressBar(lenis.progress);
  }, 250);

  window.addEventListener('resize', handleResize);

  // Start animation
  animate();

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  // Batch similar animations
  const commonAnimation = {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2
  };

  // Create animations in batch
  const sections = [
    { trigger: "#about", elements: "#about .max-w-7xl > h4, #about .max-w-7xl > h2" },
    { trigger: "#experience", elements: "#experience h1" },
    { trigger: "#works", elements: "#works h4, #works h2, #works p" },
    { trigger: "#works .grid", elements: "#works .grid > div", y: 60 },
    { trigger: "#services", elements: "#services h4, #services h2, #services > p" },
    { trigger: "#contact", elements: "#contact h4, #contact h2, #contact p" },
    { trigger: "#contact form", elements: "#contact form", duration: 1 },
    { trigger: "footer", elements: "footer > div", y: 30 }
  ];

  sections.forEach(({ trigger, elements, ...customProps }) => {
    gsap.from(elements, {
      ...commonAnimation,
      ...customProps,
      scrollTrigger: {
        trigger,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Optimize ring animation with Intersection Observer
  const ringObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.strokeDashoffset = '0';
          ringObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );

  document.querySelectorAll('.progress').forEach(ring => {
    ringObserver.observe(ring);
  });
});