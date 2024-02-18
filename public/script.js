const $button  = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
  e.preventDefault();
  $wrapper.classList.toggle('toggled');
});

// hide login sucess message after 2 sec
setTimeout(() => {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
      successMessage.style.display = 'none';
  }
}, 2000);