// DOM Elements
const galleryItems = document.querySelectorAll('.gallery-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const closeBtn = document.getElementById('close-lightbox');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentIndexSpan = document.getElementById('current-index');
const totalImagesSpan = document.getElementById('total-images');

// Variables
let currentImageIndex = 0;
let filteredItems = Array.from(galleryItems);
let activeFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set total images count
    totalImagesSpan.textContent = galleryItems.length;
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Filter buttons functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            activeFilter = button.getAttribute('data-filter');
            
            // Filter gallery items
            filterGallery(activeFilter);
        });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    
    // Previous image
    prevBtn.addEventListener('click', showPrevImage);
    
    // Next image
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
});

// Filter gallery by category
function filterGallery(filter) {
    // Reset all items
    galleryItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Show filtered items
    if (filter === 'all') {
        galleryItems.forEach(item => {
            item.style.display = 'block';
            // Add animation
            item.style.animation = 'fadeIn 0.5s ease forwards';
        });
        filteredItems = Array.from(galleryItems);
    } else {
        const itemsToShow = document.querySelectorAll(`.gallery-item[data-category="${filter}"]`);
        itemsToShow.forEach(item => {
            item.style.display = 'block';
            // Add animation
            item.style.animation = 'fadeIn 0.5s ease forwards';
        });
        filteredItems = Array.from(itemsToShow);
    }
    
    // Reset current image index
    currentImageIndex = 0;
}

// Open lightbox with selected image
function openLightbox(index) {
    // Update filtered items based on active filter
    if (activeFilter === 'all') {
        filteredItems = Array.from(galleryItems);
    } else {
        filteredItems = Array.from(document.querySelectorAll(`.gallery-item[data-category="${activeFilter}"]`));
    }
    
    // Find the index in the filtered items array
    const clickedItem = galleryItems[index];
    const dataCategory = clickedItem.getAttribute('data-category');
    
    // If the clicked item doesn't match the active filter, change filter
    if (activeFilter !== 'all' && dataCategory !== activeFilter) {
        // Update filter buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === dataCategory) {
                btn.classList.add('active');
            }
        });
        
        // Update active filter
        activeFilter = dataCategory;
        
        // Filter gallery
        filterGallery(activeFilter);
    }
    
    // Find the index in the filtered array
    currentImageIndex = filteredItems.findIndex(item => item === clickedItem);
    
    // Display lightbox
    lightbox.style.display = 'flex';
    
    // Update lightbox content
    updateLightboxContent();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Update lightbox content
function updateLightboxContent() {
    const currentItem = filteredItems[currentImageIndex];
    const imgSrc = currentItem.querySelector('img').getAttribute('src');
    const title = currentItem.querySelector('h3').textContent;
    const description = currentItem.querySelector('p').textContent;
    
    // Set lightbox content
    lightboxImg.setAttribute('src', imgSrc);
    lightboxImg.setAttribute('alt', title);
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    
    // Update image counter
    currentIndexSpan.textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = filteredItems.length;
    
    // Disable/enable navigation buttons
    prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'flex';
    nextBtn.style.display = currentImageIndex === filteredItems.length - 1 ? 'none' : 'flex';
}

// Show previous image
function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxContent();
    }
}

// Show next image
function showNextImage() {
    if (currentImageIndex < filteredItems.length - 1) {
        currentImageIndex++;
        updateLightboxContent();
    }
}

// Close lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add CSS animation for fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
