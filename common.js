document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const siteFooter = document.querySelector('.site-footer');
  const backgroundText = document.querySelector('.footer-background-text');
  const footerColumns = gsap.utils.toArray('.footer-column');
  const footerLogo = document.querySelector('.footer-logo');
  const socialIcons = gsap.utils.toArray('.social-icons a'); // Changed to gsap.utils.toArray

  // --- 1. Fade In Background Text ---
  if (backgroundText) {
    gsap.fromTo(backgroundText,
      { opacity: 0, y: 50 },
      {
        opacity: 0.2,
        y: 0,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: siteFooter,
          start: "top 80%",
          end: "bottom +=200",
          scrub: 0.5,
        },
      }
    );
  }

  // --- 2. Slide In Footer Columns ---
  footerColumns.forEach((column, index) => {
    const direction = index % 2 === 0 ? -50 : 50;
    gsap.fromTo(column,
      { x: direction, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: column,
          start: "top 85%", // Changed from 90% to 85%
          end: "bottom +=100",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // --- 3. Scale Up Footer Logo ---
  if (footerLogo) {
    gsap.fromTo(footerLogo,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: "elastic.out(1, 0.75)",
        scrollTrigger: {
          trigger: footerLogo,
          start: "top 85%", // Changed from 90% to 85%
          end: "bottom +=50",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // --- 4. Staggered Fade In for Social Icons ---
  if (socialIcons.length) {
    // Fallback animation that will always play
    gsap.to(socialIcons, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.15,
      delay: 0.5,
      ease: "power3.out"
    });

    // Scroll-triggered animation as enhancement
    gsap.fromTo(socialIcons,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.footer-about', // Changed to parent container
          start: "top 75%", // More lenient trigger point
          end: "bottom +=50",
          toggleActions: "play none none reverse",
          markers: false // Set to true to debug trigger position
        },
      }
    );
  }
});