const images = document.querySelectorAll('img.lazy');
const loadAllBtn = document.getElementById('loadAllBtn');
const loadOnDemandBtn = document.getElementById('loadOnDemandBtn');

let onDemand = false;

const loadImage = (img) => {
  const src = img.getAttribute('data-src');
  if (!src) return;
  img.src = src;
  img.addEventListener('load', () => {
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  }, { once: true });
  img.addEventListener('error', () => {
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  }, { once: true });
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !onDemand) {
      loadImage(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px 0px', threshold: 0.1 });

images.forEach(img => img.getAttribute('data-src') && observer.observe(img));

loadAllBtn.addEventListener('click', () => {
  document.querySelectorAll('img.lazy[data-src]').forEach(img => {
    loadImage(img);
    observer.unobserve(img);
  });
});

loadOnDemandBtn.addEventListener('click', () => {
  onDemand = !onDemand;
  
  if (onDemand) {
    observer.disconnect();
    loadOnDemandBtn.textContent = 'Вимкнути завантаження за натисканням';
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        if (img.getAttribute('data-src')) loadImage(img);
      }, { once: true });
    });
  } else {
    loadOnDemandBtn.textContent = 'Завантажити за натисканням';
    images.forEach(img => img.getAttribute('data-src') && (observer.observe(img), img.style.cursor = 'default'));
  }
});
