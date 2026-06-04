    document.addEventListener('DOMContentLoaded', () => {

      // ==========================================
      // MOBILE HEADER ACTION
      // ==========================================
      const hamburger = document.getElementById('hamburger-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileLinks = document.querySelectorAll('.mobile-nav-link');

      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('open');
        });
      });

      // Sticky glass effect on scroll
      const header = document.getElementById('header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      });


      // ==========================================
      // DIGITAL PARTICLE NETWORK CANVAS
      // ==========================================
      const canvas = document.getElementById('hero-canvas');
      const ctx = canvas.getContext('2d');

      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;

      // Handle window resize
      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const particles = [];
      const properties = {
        bgColor: '#090b0f',
        particleColor: 'rgba(0, 214, 255, 0.4)',
        linkColor: 'rgba(0, 214, 255, 0.08)',
        particleRadius: 1.5,
        particleCount: 65,
        particleMaxVelocity: 0.5,
        lineLength: 120,
      };

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.velocityX = (Math.random() * 2 - 1) * properties.particleMaxVelocity;
          this.velocityY = (Math.random() * 2 - 1) * properties.particleMaxVelocity;
        }

        position() {
          if (this.x + this.velocityX > width || this.x + this.velocityX < 0) {
            this.velocityX = -this.velocityX;
          }
          if (this.y + this.velocityY > height || this.y + this.velocityY < 0) {
            this.velocityY = -this.velocityY;
          }
          this.x += this.velocityX;
          this.y += this.velocityY;
        }

        reDraw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = properties.particleColor;
          ctx.fill();
        }
      }

      function drawLines() {
        let x1, y1, x2, y2, length, opacity;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            x1 = particles[i].x;
            y1 = particles[i].y;
            x2 = particles[j].x;
            y2 = particles[j].y;
            length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            if (length < properties.lineLength) {
              opacity = 1 - length / properties.lineLength;
              ctx.lineWidth = '0.5';
              ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.15})`;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
      }

      function initParticles() {
        particles.length = 0;
        for (let i = 0; i < properties.particleCount; i++) {
          particles.push(new Particle());
        }
      }

      function loop() {
        ctx.clearRect(0, 0, width, height);
        drawLines();
        for (let i = 0; i < particles.length; i++) {
          particles[i].position();
          particles[i].reDraw();
        }
        requestAnimationFrame(loop);
      }

      initParticles();
      loop();


      // ==========================================
      // HERO DYNAMIC TYPING EFFECT
      // ==========================================
      const textArray = ["Data Engineer", "Business Analyst", "Forensic Analytics Specialist"];
      const typingSpeed = 100;
      const erasingSpeed = 60;
      const newWordDelay = 2000;
      let textArrayIndex = 0;
      let charIndex = 0;
      const typingSpan = document.getElementById("typing-text");

      function type() {
        if (charIndex < textArray[textArrayIndex].length) {
          typingSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          setTimeout(erase, newWordDelay);
        }
      }

      function erase() {
        if (charIndex > 0) {
          typingSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
          charIndex--;
          setTimeout(erase, erasingSpeed);
        } else {
          textArrayIndex++;
          if (textArrayIndex >= textArray.length) textArrayIndex = 0;
          setTimeout(type, typingSpeed + 500);
        }
      }

      if (textArray.length) setTimeout(type, newWordDelay);


      // ==========================================
      // GPA GAUGE RADIAL ANIMATION
      // ==========================================
      const gpaCircle = document.getElementById('gpa-circle');
      // Max GPA is 4.00, Sakith's is 3.22 (80.5% fill)
      const maxGpa = 4.00;
      const studentGpa = 3.22;
      const percentage = studentGpa / maxGpa;
      const radius = 70;
      const circumference = 2 * Math.PI * radius; // ~439.8

      // Initial state
      gpaCircle.style.strokeDasharray = circumference;
      gpaCircle.style.strokeDashoffset = circumference;

      // Dynamic trigger when about section is viewed
      const observeGpa = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const offset = circumference - (percentage * circumference);
            gpaCircle.style.strokeDashoffset = offset;
            observeGpa.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      const aboutSection = document.getElementById('about');
      if (aboutSection) observeGpa.observe(aboutSection);


      // ==========================================
      // DYNAMIC PORTFOLIO FILTERING
      // ==========================================
      const filterBtns = document.querySelectorAll('.filter-btn');
      const projectCards = document.querySelectorAll('.project-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Toggle Active Class
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-filter');

          projectCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category').split(' ');

            if (filterValue === 'all' || cardCategories.includes(filterValue)) {
              card.classList.remove('hide');
              card.classList.add('show');
            } else {
              card.classList.remove('show');
              card.classList.add('hide');
            }
          });
        });
      });


      // ==========================================
      // ACTIVE SCROLL NAVIGATION HIGHLIGHTER
      // ==========================================
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link:not(.mobile-nav-link)');

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35
      };

      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(sec => {
        if (sec.id) scrollObserver.observe(sec);
      });


      // ==========================================
      // SCROLL-TRIGGERED FADE-UP ANIMATIONS
      // ==========================================
      const fadeElements = document.querySelectorAll('.fade-up');
      
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      fadeElements.forEach(el => fadeObserver.observe(el));


      // ==========================================
      // COPY TO CLIPBOARD BADGES
      // ==========================================
      const copyBtns = document.querySelectorAll('.contact-copy-btn');
      
      copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const textToCopy = btn.getAttribute('data-copy');
          navigator.clipboard.writeText(textToCopy).then(() => {
            const tooltip = btn.nextElementSibling;
            if (tooltip && tooltip.classList.contains('copy-success-tooltip')) {
              tooltip.classList.add('show');
              setTimeout(() => {
                tooltip.classList.remove('show');
              }, 1500);
            }
          });
        });
      });


      // ==========================================
      // REAL SPRING BOOT CONTACT FORM SUBMISSION HOOK
      // ==========================================
      const contactForm = document.getElementById('contact-form');
      const successOverlay = document.getElementById('form-success');

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Grab form input values
        const nameVal = document.getElementById('form-name').value;
        const emailVal = document.getElementById('form-email').value;
        const messageVal = document.getElementById('form-message').value;

        // Dynamic loading transition inside submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
          Transmitting Data...
        `;

        // Send a real POST request to Spring Boot Rest endpoint
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            message: messageVal
          })
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errData => {
              throw new Error(errData.message || 'Server error occurred.');
            });
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 'success') {
            successOverlay.classList.add('active');
            contactForm.reset();
          } else {
            alert('Transmission failed: ' + (data.message || 'Unknown server error'));
          }
        })
        .catch(err => {
          console.error('Error dispatching message:', err);
          alert('Transmission failed: ' + err.message);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
        });
      });

    });
