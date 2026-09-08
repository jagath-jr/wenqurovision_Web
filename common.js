// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {

  // --- 1. LOAD THE HEADER ---
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the fetched HTML into the placeholder
      document.getElementById("header-placeholder").innerHTML = data;

      // --- 2. HEADER-RELATED FUNCTIONALITY (after header is loaded) ---

      // Helper: close the mobile menu
      const closeMenu = function () {
        const navMenu = document.getElementById("navMenu");
        if (navMenu) {
          navMenu.classList.remove("show");
        }
      };

      // Mobile menu toggle functionality
      window.toggleMenu = function (event) {
        if (event) {
          event.stopPropagation(); // prevent outside-click from instantly re-closing
        }
        const navMenu = document.getElementById("navMenu");
        if (navMenu) {
          navMenu.classList.toggle("show");
        }
      };

      // Close when clicking OUTSIDE the menu (mobile view)
      document.addEventListener("click", function (event) {
        const navMenu = document.getElementById("navMenu");
        const menuIcon = document.querySelector(".menu-icon");

        if (!navMenu || !navMenu.classList.contains("show")) {
          return; // menu is not open, do nothing
        }

        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedMenuIcon = menuIcon && menuIcon.contains(event.target);

        if (!clickedInsideMenu && !clickedIcon) {
          closeMenu();
        }
      });

      // Close the mobile menu when a nav link or Contact button is clicked
      const navItems = document.querySelectorAll(
        "#navMenu .nav-links a, #navMenu .btn-outline"
      );
      navItems.forEach(function (item) {
        item.addEventListener("click", closeMenu);
      });

      // Header scroll-hide functionality
      const headerWrapper = document.getElementById("headerWrapper");
      if (headerWrapper) {
        let lastScrollTop = 0;

        window.addEventListener("scroll", function () {
          const navMenu = document.getElementById("navMenu");

          // If menu is open and user scrolls → close menu, don't hide header
          if (navMenu && navMenu.classList.contains("show")) {
            closeMenu();
            return;
          }

          let scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

          if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down (after 50px to avoid jitter at top) → hide header
            headerWrapper.classList.add("hide-header");
          } else {
            // Scrolling up → show header
            headerWrapper.classList.remove("hide-header");
          }

          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
      }

      // Keep body padding in sync with actual header height
      const syncPadding = function () {
        const wrapper = document.getElementById("headerWrapper");
        if (wrapper) {
          document.body.style.paddingTop = wrapper.offsetHeight + "px";
        }
      };
      syncPadding();
      window.addEventListener("resize", syncPadding);
    })
    .catch(function (error) {
      console.error("Error loading the header:", error);
    });

  // --- 3. LOAD THE FOOTER (with GSAP animations) ---

  // Early return if GSAP isn't available
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger not available");
    return;
  }

  const footerContainer = document.getElementById("common-footer");
  if (!footerContainer) {
    console.warn("Footer container element not found");
    return;
  }

  // Load footer dynamically with path resolution
  const loadFooter = async function () {
    try {
      // Determine correct path based on current location
      const isServicesPage = window.location.pathname.includes("/services/");
      const footerPath = isServicesPage ? "../footer.html" : "footer.html";

      console.log("Attempting to load footer from:", footerPath);

      const response = await fetch(footerPath);
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const html = await response.text();
      footerContainer.innerHTML = html;
    } catch (err) {
      console.error("Error loading footer, using fallback:", err);
      const isServicesPage = window.location.pathname.includes("/services/");
      const basePath = isServicesPage ? "../" : "./";

      footerContainer.innerHTML = `
        <div class="footer-fallback" style="text-align: center; padding: 20px;">
          <h4QUICK LINKS</h4>
          <p><a href="basePathindex.html">Home</a>∣<ahref="{basePath}index.html">Home</a> | <a href="basePathindex.html">Home</a>∣<ahref="{basePath}services/services.html">Services</a></p>
          <h4>CONTACT US</h4>
          <p>123 Tech Street, Thiruvananthapuram</p>
          <p class="copyright">© ${new Date().getFullYear()} Duvitra. All rights reserved.</p>
        </div>
      `;
    } finally {
      // Runs after either try or catch, ensuring animations always initialize
      initializeFooterAnimations();
    }
  };

  // Initialize animations after footer content is in the DOM
  const initializeFooterAnimations = function () {
    const select = function (selector) {
      return document.querySelector(selector);
    };

    const siteFooter = select(".site-footer");
    if (!siteFooter) {
      console.warn("'.site-footer' not found, skipping animations.");
      return;
    }

    const backgroundText = select(".footer-background-text");
    const footerColumns = gsap.utils.toArray(".footer-column");
    const footerLogo = select(".footer-logo");
    const socialIconsContainer = select(".social-icons");
    const socialIcons = gsap.utils.toArray(".social-icons a");

    // --- 1. Fade In Background Text ---
    if (backgroundText) {
      gsap.fromTo(
        backgroundText,
        { opacity: 0, y: 50 },
        {
          opacity: 0.2,
          y: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: siteFooter,
            start: "top 80%",
            scrub: 0.5,
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // --- 2. Slide In Footer Columns ---
    footerColumns.forEach(function (column, index) {
      const direction = index % 2 === 0 ? -50 : 50;
      gsap.fromTo(
        column,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: column,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // --- 3. Scale Up Footer Logo ---
    if (footerLogo) {
      gsap.fromTo(
        footerLogo,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: footerLogo,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // --- 4. Staggered Fade In for Social Icons ---
    if (socialIconsContainer && socialIcons.length) {
      gsap.fromTo(
        socialIcons,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: socialIconsContainer,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  };

  // Start the footer loading process
  loadFooter();
});
