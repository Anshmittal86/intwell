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

// Contact Form

mobileMenuIcon.addEventListener('click', () => {
  // mobileNavbarEl.classList.toggle('hidden');
  navbarEl.classList.toggle('active');
});
