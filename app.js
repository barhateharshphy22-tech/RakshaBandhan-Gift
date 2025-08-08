// Raksha Bandhan Memories Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeGallery();
    initializeMemoryEditing();
    initializeScrollAnimations();
    initializeInteractiveElements();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remove active class from all nav links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Calculate offset for fixed header if needed
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Gallery lightbox functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxIcon = document.querySelector('.lightbox-icon');
    
    if (!lightbox) {
        console.error('Lightbox element not found');
        return;
    }
    
    // Photo data from the application data
    const photoData = {
        1: { icon: '📷', title: 'Childhood Garden Memories', caption: 'Childhood memories of playing together in the garden' },
        2: { icon: '🎒', title: 'School Days', caption: 'First day of school - brother protecting sister' },
        3: { icon: '🎋', title: 'Last Year\'s Rakhi', caption: 'Raksha Bandhan celebration from last year' },
        4: { icon: '🏖️', title: 'Beach Vacation', caption: 'Family vacation memories by the beach' },
        5: { icon: '🎂', title: 'Birthday Fun', caption: 'Birthday celebration with homemade cake' },
        6: { icon: '🎭', title: 'Festival Attire', caption: 'Festival celebrations with traditional clothes' },
        7: { icon: '📚', title: 'Study Time', caption: 'Study sessions and homework help' },
        8: { icon: '🌟', title: 'Recent Times', caption: 'Recent photo showing how we\'ve grown' }
    };
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const photoId = this.getAttribute('data-id');
            const photo = photoData[photoId];
            
            if (photo && lightboxIcon && lightboxTitle && lightboxCaption) {
                lightboxIcon.textContent = photo.icon;
                lightboxTitle.textContent = photo.title;
                lightboxCaption.textContent = photo.caption;
                
                // Show lightbox
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.cursor = 'pointer';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Close lightbox functionality
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    // Close lightbox when clicking outside content
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}

// Memory editing functionality
function initializeMemoryEditing() {
    const memoryTexts = document.querySelectorAll('.memory-text[contenteditable="true"]');
    
    memoryTexts.forEach((memoryText, index) => {
        // Store original text
        const originalText = memoryText.textContent;
        
        // Ensure the element is properly editable
        memoryText.setAttribute('contenteditable', 'true');
        memoryText.style.outline = 'none';
        
        // Add focus event
        memoryText.addEventListener('focus', function(e) {
            e.stopPropagation();
            this.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
            this.style.border = '2px solid var(--rakhi-gold)';
            this.style.borderRadius = 'var(--radius-sm)';
            this.style.padding = 'var(--space-8)';
            this.style.position = 'relative';
            this.style.zIndex = '10';
        });
        
        // Add blur event
        memoryText.addEventListener('blur', function(e) {
            this.style.backgroundColor = '';
            this.style.border = '';
            this.style.borderRadius = '';
            this.style.padding = '';
            this.style.zIndex = '';
            
            // Show save feedback
            showMemorySavedFeedback(this);
        });
        
        // Add click event to ensure focus works properly
        memoryText.addEventListener('click', function(e) {
            e.stopPropagation();
            this.focus();
        });
        
        // Add input event for real-time validation
        memoryText.addEventListener('input', function() {
            const currentLength = this.textContent.length;
            
            // Limit length
            if (currentLength > 200) {
                const text = this.textContent;
                this.textContent = text.substring(0, 200);
                
                // Move cursor to end
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(this);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                
                showToast('Memory text limited to 200 characters');
            }
        });
        
        // Prevent pasting of HTML content
        memoryText.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            const limitedText = text.substring(0, 200);
            
            // Insert plain text only
            if (document.execCommand) {
                document.execCommand('insertText', false, limitedText);
            } else {
                // Fallback for modern browsers
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(limitedText));
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        });
        
        // Add keyboard shortcuts
        memoryText.addEventListener('keydown', function(e) {
            // Save with Ctrl+S or Cmd+S
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.blur();
            }
            
            // Escape to cancel changes
            if (e.key === 'Escape') {
                this.textContent = originalText;
                this.blur();
            }
        });
    });
}

// Show feedback when memory is saved
function showMemorySavedFeedback(element) {
    const feedback = document.createElement('div');
    feedback.textContent = '✓ Memory saved';
    feedback.style.cssText = `
        position: fixed;
        background: var(--rakhi-green);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        top: 20px;
        right: 20px;
        animation: slideInOut 2s ease-in-out;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(feedback);
    
    // Remove feedback after animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--rakhi-orange);
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        animation: slideInOut 3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(`
        .welcome-card,
        .gallery-item,
        .memory-card,
        .wish-card,
        .significance-content
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add interactive hover effects to cards (but not gallery items to avoid conflicts)
    const cards = document.querySelectorAll('.memory-card, .wish-card, .welcome-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('gallery-item')) {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('gallery-item')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add parallax effect to decorative elements
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.decorative-element');
                
                parallaxElements.forEach(element => {
                    const speed = 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initialize floating animation for certain elements
    initializeFloatingAnimation();
    
    // Add keyboard navigation support
    initializeKeyboardNavigation();
}

// Floating animation for decorative elements
function initializeFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.diya, .mandala-decoration, .rangoli-pattern');
    
    floatingElements.forEach((element, index) => {
        // Create unique floating animation
        const duration = 3 + (index * 0.5); // 3s, 3.5s, 4s, etc.
        const delay = index * 0.3; // 0s, 0.3s, 0.6s, etc.
        
        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
    });
    
    // Add floating keyframes if not already added
    if (!document.getElementById('floating-styles')) {
        const style = document.createElement('style');
        style.id = 'floating-styles';
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); }
                100% { transform: translateY(-10px) rotate(2deg); }
            }
            
            @keyframes slideInOut {
                0% { opacity: 0; transform: translateX(100%); }
                10% { opacity: 1; transform: translateX(0); }
                90% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    // Enable keyboard navigation for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View photo ${index + 1}`);
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = galleryItems[index + 1];
                if (nextItem) {
                    nextItem.focus();
                }
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = galleryItems[index - 1];
                if (prevItem) {
                    prevItem.focus();
                }
            }
        });
    });
    
    // Enable keyboard navigation for memory cards
    const memoryCards = document.querySelectorAll('.memory-text[contenteditable="true"]');
    
    memoryCards.forEach((card, index) => {
        card.setAttribute('role', 'textbox');
        card.setAttribute('aria-label', `Editable memory ${index + 1}`);
        
        card.addEventListener('keydown', function(e) {
            // Tab to next memory card (only if not in edit mode)
            if (e.key === 'Tab' && !e.shiftKey && document.activeElement !== this) {
                const nextCard = memoryCards[index + 1];
                if (nextCard) {
                    e.preventDefault();
                    nextCard.focus();
                }
            }
            
            // Shift+Tab to previous memory card (only if not in edit mode)
            if (e.key === 'Tab' && e.shiftKey && document.activeElement !== this) {
                const prevCard = memoryCards[index - 1];
                if (prevCard) {
                    e.preventDefault();
                    prevCard.focus();
                }
            }
        });
    });
}

// Initialize welcome animations
window.addEventListener('load', function() {
    // Add welcome animation
    const header = document.querySelector('.header');
    if (header) {
        header.style.animation = 'slideInDown 1s ease-out';
    }
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.animation = 'fadeIn 1.5s ease-out 0.5s both';
    }
    
    // Trigger initial scroll animations
    window.dispatchEvent(new Event('scroll'));
});

// Add welcome animations styles
const welcomeAnimationStyles = document.createElement('style');
welcomeAnimationStyles.textContent = `
    @keyframes slideInDown {
        0% {
            opacity: 0;
            transform: translateY(-100px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;
document.head.appendChild(welcomeAnimationStyles);
