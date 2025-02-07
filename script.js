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
        navBar.classList.add('FF9E17', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm')
    } else {
        navBar.classList.remove('FF9E17', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm')
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
