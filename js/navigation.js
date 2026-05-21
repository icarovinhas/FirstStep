function toggleMenu() {
  document.getElementById('main-nav').classList.toggle('open');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal && closeModal();
});
