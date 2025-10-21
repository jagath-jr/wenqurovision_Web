document.addEventListener("DOMContentLoaded", function () {
  /**
   * Mobile Menu Toggle
   */
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.querySelector('.menu-icon');

  if (menuIcon) {
    menuIcon.addEventListener('click', function () {
      navMenu.classList.toggle('show');
      this.textContent = navMenu.classList.contains('show') ? '✖' : '☰';
    });
  }

  /**
   * Hide Header on Scroll Down
   */
  const headerWrapper = document.getElementById('headerWrapper');
  if (headerWrapper) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > headerWrapper.offsetHeight) {
        // Scrolling down
        headerWrapper.classList.add('hide-header');
      } else {
        // Scrolling up
        headerWrapper.classList.remove('hide-header');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  /**
   * Animated Counter with Intersection Observer
   */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const animateCounters = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
              const increment = target / 100; // Animation speed
              count += increment;
              if (count < target) {
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
          });
          observer.unobserve(entry.target); // Animate only once
        }
      });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
      threshold: 0.5
    });
    counterObserver.observe(statsSection);
  }

  /**
   * Enhanced Hero Slider with Navigation Controls
   */
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.hero-slider .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds per slide
    let slideTimer;
    let isHovering = false;

    function showSlide(index, direction = 'next') {
      // Wrap around if at ends
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }
      
      // Remove active classes
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-left', 'slide-right', 'fade-in', 'zoom-in', 'flip-in', 'float-up');
        if (dots[i]) dots[i].classList.remove('active');
      });
      
      // Add appropriate animation class based on direction
      const animationClass = slides[currentSlide].dataset.anim || 'fade-in';
      slides[currentSlide].classList.add('active', animationClass);
      
      // Update active dot
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
      
      // Reset timer when manually navigating
      if (!isHovering) resetTimer();
    }

    function nextSlide() {
      showSlide(currentSlide + 1, 'next');
    }

    function prevSlide() {
      showSlide(currentSlide - 1, 'prev');
    }

    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, slideInterval);
    }

    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.dataset.index);
        const direction = targetIndex > currentSlide ? 'next' : 'prev';
        showSlide(targetIndex, direction);
      });
    });

    // Button navigation
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => {
      isHovering = true;
      clearInterval(slideTimer);
    });

    heroSlider.addEventListener('mouseleave', () => {
      isHovering = false;
      resetTimer();
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      const threshold = 50; // Minimum swipe distance
      if (touchEndX < touchStartX - threshold) {
        nextSlide(); // Swipe left
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide(); // Swipe right
      }
    }

    // Initialize
    showSlide(0);
    resetTimer();
  }

  /**
   * Services Carousel (Improved Version)
   */
  const servicesData = [
    {
      img: 'Home-img/HVAC Workshome.webp',
      title: 'HVAC Works',
      desc: 'Installation, maintenance, commissioning of all types of air-conditioning systems including FCU, AHU, FAHU, VAV, CAV, CCU, and DX units. Ducting, insulation, chilled water systems & air balancing services.',
      link: 'services.html#aluminium-and-glass'
    },
    {
      img: 'Our service images/Electrical Works.webp',
      title: 'Electrical Works',
      desc: 'Installation, testing, and maintenance of electrical systems including control panels, SMDB, MCB, cable pulling & dressing, tray works, light fittings, and all types of device installations across UAE.',
      link: 'services.html#doors-and-windows'
    },
    {
      img: 'Our service images/Plumbing Works.webp',
      title: 'Plumbing Works',
      desc: 'Installation and maintenance of all plumbing and drainage systems including booster, transfer, submersible, circulation, and irrigation pumps. Complete piping works in PVC, UPVC, PPR, and HDPE',
      link: 'services.html#cladding-solution'
    },
    {
      img: 'Our service images/Civil.webp',
      title: 'Civil Works',
      desc: 'Comprehensive construction and maintenance services including wall & floor painting, tile installation, masonry work, and all types of building repair and renovation activities.',
      link: 'services.html#civil-works'
    }

  ];

  const carouselTrack = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');

  if (carouselTrack && dotsContainer) {
    // Populate service cards
    servicesData.forEach(service => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="image" style="background-image: url('${service.img}');"></div>
        <div class="content">
          <h4>${service.title}</h4>
          <p>${service.desc}</p>
          <a href="${service.link}" class="btn-small">Read More</a>
        </div>
      `;
      carouselTrack.appendChild(card);
    });

    const originalCards = Array.from(carouselTrack.children);
    const totalOriginalCards = originalCards.length;
    let currentIndex = 0;
    let autoPlayInterval;

    // Clone cards for infinite loop
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      carouselTrack.appendChild(clone);
    });

    // Create dots
    for (let i = 0; i < totalOriginalCards; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    }
    const carouselDots = dotsContainer.querySelectorAll('.dot');

    const updateCarousel = (animate = true) => {
      const cardWidth = carouselTrack.querySelector('.service-card').offsetWidth;
      const cardMargin = parseInt(window.getComputedStyle(carouselTrack.querySelector('.service-card')).marginRight) + 
                        parseInt(window.getComputedStyle(carouselTrack.querySelector('.service-card')).marginLeft);
      const totalWidth = cardWidth + cardMargin;

      carouselTrack.style.transition = animate ? 'transform 0.7s ease-in-out' : 'none';
      carouselTrack.style.transform = `translateX(-${currentIndex * totalWidth}px)`;

      // Update active dot
      carouselDots.forEach(d => d.classList.remove('active'));
      if (carouselDots[currentIndex % totalOriginalCards]) {
        carouselDots[currentIndex % totalOriginalCards].classList.add('active');
      }
    };

    const handleNext = () => {
      currentIndex++;
      updateCarousel();

      if (currentIndex >= totalOriginalCards) {
        setTimeout(() => {
          carouselTrack.style.transition = 'none';
          currentIndex = 0;
          updateCarousel(false);
        }, 700);
      }
    };

    const handlePrev = () => {
      if (currentIndex === 0) {
        carouselTrack.style.transition = 'none';
        currentIndex = totalOriginalCards;
        updateCarousel(false);
      }
      setTimeout(() => {
        currentIndex--;
        updateCarousel(true);
      }, 50); // Small delay to ensure transition applies
    };

    const startAutoplay = () => {
      stopAutoplay(); // Clear existing interval
      autoPlayInterval = setInterval(handleNext, 3000);
    };

    const stopAutoplay = () => {
      clearInterval(autoPlayInterval);
    };

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
      handleNext();
      startAutoplay(); // Reset autoplay timer on manual navigation
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      handlePrev();
      startAutoplay(); // Reset autoplay timer
    });

    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);

    dotsContainer.addEventListener('click', e => {
      if (e.target.classList.contains('dot')) {
        currentIndex = parseInt(e.target.dataset.index);
        updateCarousel();
        startAutoplay(); // Reset autoplay timer
      }
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50; // Minimum swipe distance
      if (touchEndX < touchStartX - threshold) {
        handleNext(); // Swipe left
      } else if (touchEndX > touchStartX + threshold) {
        handlePrev(); // Swipe right
      }
    }

    // Initialize
    updateCarousel(false);
    startAutoplay();

    window.addEventListener('resize', () => updateCarousel(false));
  }
});
// script.js

document.addEventListener('DOMContentLoaded', () => {
    // GSAP animation for the section title
    gsap.from(".section-title-unique", {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out"
    });

    // GSAP animation for testimonial cards on load
    gsap.from(".testimonial-card-unique", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2, // Stagger the animation for each card
        delay: 0.5 // Delay the start of card animations slightly
    });

    // Example of a hover effect using GSAP (optional, as CSS handles basic hover)
    // You could use this for more complex interactive hover animations
    document.querySelectorAll('.testimonial-card-unique').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.02, duration: 0.2, ease: "power1.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.2, ease: "power1.out" });
        });
    });

    // Add more JavaScript interactivity here as needed
    // For example, if you wanted to implement a carousel or a "read more" feature.
});


document.addEventListener('DOMContentLoaded', function() {
    // Animate service boxes when they come into view
    const serviceBoxes = document.querySelectorAll('.service-box');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function checkBoxes() {
        serviceBoxes.forEach(box => {
            if (isInViewport(box)) {
                box.classList.add('animate-in');
            }
        });
    }
    
    // Initial check in case boxes are already in view
    checkBoxes();
    
    // Check on scroll
    window.addEventListener('scroll', checkBoxes);
    
    // For browsers that don't support Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        serviceBoxes.forEach(box => {
            observer.observe(box);
        });
    }
});
// script.js

// This file is ready for any future JavaScript-based interactivity.
// For example, you could add event listeners to the logos.

document.addEventListener('DOMContentLoaded', () => {
    const logos = document.querySelectorAll('.slide img');

    logos.forEach(logo => {
        logo.addEventListener('click', () => {
            // Example: Get the alt text of the clicked logo
            const clientName = logo.alt.replace(' Logo', '');
            console.log(`You clicked on the ${clientName} logo.`);
            
            // You can replace the console.log with any action,
            // such as opening a new page or displaying a modal.
            // window.open('https://example.com/clients/' + clientName, '_blank');
        });
    });

    console.log("Trusted Clients section is interactive.");
});

// Wait for the document content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Select the paragraph element containing the quote
    const quoteTextElement = document.querySelector('.quote-text');

    // If the element doesn't exist on the page, stop the script
    if (!quoteTextElement) {
        return;
    }

    // --- 1. Prepare the text for animation ---
    // This splits the quote into individual character `<span>` elements,
    // but keeps them hidden initially by not adding the 'visible' class.
    const text = quoteTextElement.textContent;
    quoteTextElement.textContent = ''; // Clear original text
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        // Use a non-breaking space for space characters to ensure they take up space
        span.textContent = char === ' ' ? '\u00A0' : char;
        quoteTextElement.appendChild(span);
    });

    // --- 2. Create the function that runs the animation ---
    const startAnimation = () => {
        const charSpans = quoteTextElement.querySelectorAll('span');
        charSpans.forEach((span, index) => {
            // Set a timeout to add the 'visible' class sequentially, creating the effect
            setTimeout(() => {
                span.classList.add('visible');
            }, index * 50); // 50ms delay between each character
        });
    };
    
    // --- 3. Set up the Intersection Observer ---
    // This will watch the quote element and trigger a function when it enters the viewport.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the element is intersecting (i.e., visible on screen)
            if (entry.isIntersecting) {
                startAnimation(); // If it is, run our animation
                observer.unobserve(entry.target); // Then, stop observing to ensure it only runs once
            }
        });
    }, {
        // Options for the observer
        root: null, // null means it observes in relation to the main browser viewport
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    // --- 4. Start observing the quote element ---
    observer.observe(quoteTextElement);

});