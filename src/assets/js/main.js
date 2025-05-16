import '../css/output.css';

import './chatbot';

const servicesContainerEl = document.querySelector('#services-container');
const mobileMenuIcon = document.querySelector('#mobile-menu');
const navbarEl = document.querySelector('nav');

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Get Services
async function getServices() {
  try {
    const response = await fetch('/intwell.json');
    const data = await response.json();
    const services = data.services;

    services.forEach((service) => {
      const { id, image, service: serviceName, description } = service;

      servicesContainerEl.innerHTML += `
        <div class="w-full bg-white border flex flex-col justify-center items-center border-gray-200 rounded-lg shadow-sm p-5 text-center line-animation" data-aos="fade-up">
          <img
            class="rounded-t-lg mb-4"
            src="${image}"
            alt="Service Image"
            loading="lazy"
            width="150"
            height="150"
          />
          <div>
              <h3 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                ${serviceName}
              </h3>
            <p class="mb-3 font-normal text-gray-700 text-justify">
              ${description}
            </p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error loading services:', error);
  }

  // Mobile menu toggle
  mobileMenuIcon.addEventListener('click', () => {
    navbarEl.classList.toggle('active');
  });
}

// Validate form and submit
function validateForm() {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Create status message element
    const statusMessage = document.createElement('p');
    statusMessage.className = 'text-green-600 font-medium mt-4';
    form.appendChild(statusMessage);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Show loader / disable button
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('bg-purple-600', 'text-white', 'cursor-not-allowed');

      console.log(this, import.meta.env.VITE_SERVICE_ID);

      emailjs
        .sendForm(
          import.meta.env.VITE_SERVICE_ID,
          import.meta.env.VITE_TEMPLATE_ID,
          this,
          import.meta.env.VITE_PUBLIC_API
        )
        .then(
          (response) => {
            form.reset();
            statusMessage.textContent = 'Message sent successfully!';
            statusMessage.classList.remove('text-red-600');
            statusMessage.classList.add('text-green-600');
          },
          (error) => {
            statusMessage.textContent = 'Failed to send message. Please try again.';
            statusMessage.classList.remove('text-green-600');
            statusMessage.classList.add('text-red-600');
          }
        )
        .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
          submitButton.classList.remove('bg-purple-600', 'text-white', 'cursor-not-allowed');
        });

      setTimeout(() => {
        statusMessage.textContent = '';
      }, 5000);
    });
  });
}
// Smooth scroll

function handleSmoothScroll() {
  let smoother = ScrollSmoother.create({
    wrapper: '#main',
    content: '#content',
    smooth: 1.2,
    effects: true
  });

  // Handle Anchor links smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        smoother.scrollTo(target, true); // true = animate
      }
    });
  });
}

function handleGsapAnimation() {
  gsap.to('.up-arrow', {
    y: -5,
    repeat: -1,
    yoyo: true,
    duration: 0.4
  });

  gsap.utils.toArray('.trigger-line-animation').forEach((triggerEl) => {
    gsap.from(triggerEl.querySelectorAll('.line-animation'), {
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 90%', // customize as needed
        toggleActions: 'play none none none'
      },
      rotationX: -100,
      transformOrigin: '50% 50% -160px',
      opacity: 0,
      duration: 1,
      ease: 'power3',
      stagger: 0.25
    });
  });
}

handleGsapAnimation();
handleSmoothScroll();
getServices();
validateForm();
