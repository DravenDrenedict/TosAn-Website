import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1200,  // Customize animation duration
    once: true,  // Only animate the element once
  });
});
