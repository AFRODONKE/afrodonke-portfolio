const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');
const siteHeader = document.querySelector('.site-header');
const portfolioMain = document.querySelector('#main');
const viewFilters = [...document.querySelectorAll('[data-view-filter]')];
const viewBack = document.querySelector('[data-view-back]');
const galleryFiles = [
  'knt-ballet-stage-performance-2025.jpg', 'knt-modern-dance-star-formation.jpg',
  '211338.jpeg', '211340.jpeg', '235415.jpeg', '235416.jpeg', '241029.jpeg',
  '241106.jpeg', '241110.jpeg', '241114.jpeg', 'IMG_20220511_134854.jpg',
  'IMG_20221202_112939.jpg', 'IMG_20221202_112953.jpg', 'IMG_20230208_145349.jpg',
  'IMG_20230308_134234.jpg', 'IMG_20230308_134308.jpg', 'IMG_7039.JPG', 'IMG_7329.JPG',
  'school-dance-showcase-img-9084.jpg',
];
let galleryItems = [];
const featuredStagePhotos = new Set([
  'knt-ballet-stage-performance-2025.jpg',
  'knt-modern-dance-star-formation.jpg',
]);
const gallery = document.querySelector('[data-gallery]');
const galleryToggle = document.querySelector('[data-gallery-toggle]');
const initialGalleryCount = 8;
let visibleGalleryCount = initialGalleryCount;
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('[data-gallery-image]');
const lightboxCount = document.querySelector('[data-gallery-count]');
let currentPhotoIndex = 0;
const galleryAltByFile = {
  '211338.jpeg': 'School dance students learning a modern dance combination.',
  '211340.jpeg': 'Students rehearsing group choreography in a dance class.',
  '235415.jpeg': 'Students practicing a choreography sequence together.',
  '235416.jpeg': 'Dance students working through class choreography.',
  '241029.jpeg': 'Students practicing Ballet and Modern Dance at school.',
  '241106.jpeg': 'Students rehearsing dance movements for a school showcase.',
  '241110.jpeg': 'Students learning choreography during school dance training.',
  '241114.jpeg': 'Students taking part in a school dance rehearsal.',
  'IMG_20220511_134854.jpg': 'Students learning dance technique during a school programme.',
  'IMG_20221202_112939.jpg': 'Students rehearsing for a Ballet and Modern Dance school showcase.',
  'IMG_20221202_112953.jpg': 'Ballet and Modern Dance students preparing for a showcase.',
  'IMG_20230208_145349.jpg': 'Students practicing a choreographed routine at school.',
  'IMG_20230308_134234.jpg': 'Students learning modern dance choreography.',
  'IMG_20230308_134308.jpg': 'Young dancers practicing a school performance routine.',
  'IMG_7039.JPG': 'Students taking part in a school Ballet and Modern Dance class.',
  'IMG_7329.JPG': 'Students preparing a routine for a school dance showcase.',
  'knt-ballet-stage-performance-2025.jpg': 'Ballet and Modern Dance stage showcase at Kenya National Theatre, 2025.',
  'school-dance-showcase-img-9084.jpg': 'Students performing on stage in a school dance showcase.',
  'knt-modern-dance-star-formation.jpg': 'Stage performance lighting and choreography at Kenya National Theatre, with modern dancers in a star formation.',
};

function getGalleryAlt(filename) {
  return galleryAltByFile[filename] ?? 'Students participating in a school dance programme.';
}

function updateGalleryVisibility() {
  const visibleCount = Math.min(visibleGalleryCount, galleryItems.length);
  galleryItems.forEach((item, index) => {
    item.button.classList.toggle('hidden', index >= visibleCount);
  });
  const canExpand = galleryItems.length > initialGalleryCount;
  const isExpanded = canExpand && visibleCount === galleryItems.length;
  galleryToggle.hidden = !canExpand;
  galleryToggle.setAttribute('aria-expanded', String(isExpanded));
  galleryToggle.textContent = isExpanded ? 'Show Less' : 'Show More Photos ↗';
}

function showPhoto(index) {
  if (!galleryItems.length) return;
  currentPhotoIndex = (index + galleryItems.length) % galleryItems.length;
  const filename = galleryItems[currentPhotoIndex].filename;
  lightboxImage.src = `assets/gallery/${filename}`;
  lightboxImage.alt = getGalleryAlt(filename);
  lightboxCount.textContent = `${String(currentPhotoIndex + 1).padStart(2, '0')} / ${galleryItems.length}`;
}

function removeBrokenImageFrame(image, frame) {
  frame.remove();
  if (frame.matches('.gallery-item')) {
    const removedIndex = galleryItems.findIndex(item => item.button === frame);
    if (removedIndex !== -1) {
      galleryItems.splice(removedIndex, 1);
      if (currentPhotoIndex >= galleryItems.length) currentPhotoIndex = Math.max(0, galleryItems.length - 1);
      else if (removedIndex < currentPhotoIndex) currentPhotoIndex -= 1;
      updateGalleryVisibility();
    }
  }
  const card = image.closest('.project-card');
  if (card && !card.querySelector('img')) card.remove();
}

document.querySelectorAll('.project-image img, .feature-project img, .about-portrait img').forEach(image => {
  const frame = image.closest('.project-image, .feature-project, .about-portrait');
  image.addEventListener('error', () => removeBrokenImageFrame(image, frame), { once: true });
  if (image.complete && !image.naturalWidth) removeBrokenImageFrame(image, frame);
});

galleryFiles.forEach(filename => {
  const button = document.createElement('button');
  button.className = 'gallery-item';
  button.dataset.category = 'school-ballet';
  if (featuredStagePhotos.has(filename)) button.classList.add('featured-stage-photo');
  button.type = 'button';
  button.setAttribute('aria-label', `Open photo: ${getGalleryAlt(filename)}`);

  const image = document.createElement('img');
  image.src = `assets/gallery/${filename}`;
  image.alt = getGalleryAlt(filename);
  image.loading = 'lazy';
  image.addEventListener('error', () => removeBrokenImageFrame(image, button), { once: true });
  button.append(image);
  galleryItems.push({ filename, button });
  button.addEventListener('click', () => {
    showPhoto(galleryItems.findIndex(item => item.button === button));
    lightbox.showModal();
  });
  gallery.append(button);
});
updateGalleryVisibility();

galleryToggle.addEventListener('click', () => {
  visibleGalleryCount = visibleGalleryCount >= galleryItems.length
    ? initialGalleryCount
    : Math.min(visibleGalleryCount + initialGalleryCount, galleryItems.length);
  updateGalleryVisibility();
});

document.querySelector('[data-gallery-prev]').addEventListener('click', () => showPhoto(currentPhotoIndex - 1));
document.querySelector('[data-gallery-next]').addEventListener('click', () => showPhoto(currentPhotoIndex + 1));
document.querySelector('[data-gallery-close]').addEventListener('click', () => lightbox.close());
document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showPhoto(currentPhotoIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhotoIndex + 1);
});

function setPortfolioView(view) {
  portfolioMain.dataset.viewState = view;
  viewBack.hidden = view === 'all';
  viewFilters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.viewFilter === view));
  });
}

viewFilters.forEach(button => {
  button.addEventListener('click', () => setPortfolioView(button.dataset.viewFilter));
});
viewBack.addEventListener('click', () => setPortfolioView('all'));

function setMenuOpen(isOpen) {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  siteMenu.hidden = !isOpen;
  siteHeader.classList.toggle('menu-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

siteMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
