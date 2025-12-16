// console.log("work js");

document.addEventListener('DOMContentLoaded', function() {

    // реализация тем
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    function initTheme() {
        const preferredTheme = getPreferredTheme();
        setTheme(preferredTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    initTheme();
 

    const burgerButton = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (!burgerButton || !navMenu || !navOverlay) {
        console.error('Not elements menu');
        return;
    }


    // открытие заерытие меню
    function toggleMenu() {
        const isMenuOpen = navMenu.classList.contains('active');

        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // open menu 
    function openMenu() {
        burgerButton.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        body.classList.add('menu-open');

        navOverlay.style.display = 'block';

        disableBodyScroll();
    }

    // close menu 
    function closeMenu() {
        burgerButton.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('menu-open');

        enableBodyScroll();

        setTimeout(() => {
            navOverlay.style.display = 'none';
        }, 300);
    }

    // zapret scroll 

    function disableBodyScroll() {
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
    }

    // est scr 

    function enableBodyScroll() {
        const scrollY = parseInt(body.style.top || '0');
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        window.scrollTo(0, -scrollY);
    }

    // sobitia 
    burgerButton.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });



    // делаем прокрутку
    // const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - 80;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });



    // подсветка раздела

    const section = document.querySelectorAll('section[id]');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        section.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    highlightActiveSection();

    window.addEventListener('scroll', highlightActiveSection);

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const successMessage = document.getElementById('successMessage');

        function validateForm() {
            let isValid = true;

            if (nameInput.value.trim().length < 2) {
                document.getElementById('nameError').textContent = 'The name must be at least 2 characters long';
                document.getElementById('nameError').style.display = 'block';
                nameInput.classList.add('error');
                isValid = false;
            } else {
                document.getElementById('nameError').style.display = 'none';
                nameInput.classList.remove('error');
            }

            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Enter the correct email address (example@mail.com)';
                document.getElementById('emailError').style.display = 'block';
                emailInput.classList.add('error');
                isValid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
                emailInput.classList.remove('error');
            }

            if (messageInput.value.trim().length < 10) {
                document.getElementById('messageError').textContent = 'The message must be at least 10 characters long';
                document.getElementById('messageError').style.display = 'block';
                messageInput.classList.add('error');
                isValid = false;
            } else {
                document.getElementById('messageError').style.display = 'none';
                messageInput.classList.remove('error');
            }

            return isValid;
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (validateForm()) {
                successMessage.innerHTML = 'The message has been sent successfully!';
                successMessage.style.display = 'block';

                contactForm.reset();

                setTimeout(function() {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        });


        nameInput.addEventListener('input', function() {
            document.getElementById('nameError').style.display = 'none';
            nameInput.classList.remove('error');
        });

        emailInput.addEventListener('input', function() {
            document.getElementById('emailError').style.display = 'none';
            emailInput.classList.remove('error');
        });

        messageInput.addEventListener('input', function() {
            document.getElementById('messageError').style.display = 'none';
            messageInput.classList.remove('error');
        });
    }


    // timer for programm


    function updateCountdown() {
        const now = new Date();
        // const nextYear = now.getFullYear() + 1;
        const currentYear = now.getFullYear();
        const newYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
        const difference = newYear - now;

        if (difference <= 0) {

            document.getElementById('timer').textContent = '00:00:00:00';
            return;

        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('timer').textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateClock() {
        const now = new Date();

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }

    function updateDate() {
        const now = new Date();

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        document.getElementById('date').textContent = `${day} ${month} ${year}`;
    }

    function updateAllDynamicElements() {
        updateCountdown();
        updateClock();
        updateDate();
    } 


    setInterval(updateAllDynamicElements, 1000);

    updateAllDynamicElements();

});