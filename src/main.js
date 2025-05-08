const servicesContainerEl = document.querySelector('#services-container');
const mobileMenuIcon = document.querySelector('#mobile-menu');
const navbarEl = document.querySelector('nav');

// Get Services
fetch('../intwell.json')
  .then((response) => response.json())
  .then((data) => {
    const services = data.services;

    services.forEach((service) => {
      const { id, image, service: serviceName, description } = service;

      servicesContainerEl.innerHTML += `
      <div class="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-5">
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
              <p class="mb-3 font-normal text-gray-700">
                ${description}
              </p>
            </div>
          </div>
      `;
    });
  });

mobileMenuIcon.addEventListener('click', () => {
  // mobileNavbarEl.classList.toggle('hidden');
  navbarEl.classList.toggle('active');
});

// Contact Form

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
