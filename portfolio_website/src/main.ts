import { error } from 'node:console';
import { MockSkillService } from './services/mock-skill.service';
import { MockThemeService } from './services/theme.service';


async function loadAndRenderSkills(): Promise<void> {
  const skillsContainer = document.querySelector('.skills ul');
  
  if (!skillsContainer) {
    console.error('Не найден контейнер для навыков!');
    return;
  }

  try {
    const skillService = new MockSkillService();
    const skills = await skillService.getSkills();
    
    skillsContainer.innerHTML = '';
    
    skills.forEach(skill => {
      const skillItem = document.createElement('li');
      skillItem.textContent = skill.name;
      skillItem.dataset.category = skill.category;
      skillsContainer.appendChild(skillItem);
    });
    
    console.log(`Загружено ${skills.length} навыков`);
  } catch (error) {
    console.error('Ошибка при загрузке навыков:', error);
    // Fallback на статические данные
    skillsContainer.innerHTML = `
      <li>Draw</li>
      <li>Photoshop</li>
      <li>HTML</li>
      <li>CSS</li>
      <li>Python</li>
      <li>C++</li>
      <li>3DMax</li>
      <li>Illustrator</li>
      <li>AE</li>
    `;
  }
}

async function initThemeSystem(): Promise<void> {
    const themeService = new MockThemeService();
    const currentTheme = await themeService.getCurrentTheme();

    await themeService.setTheme(currentTheme.id);

    const themeToggle: HTMLButtonElement | null = document.querySelector('.theme-toggle');
    const themeIcon: HTMLElement | null = document.querySelector('.theme-icon');

    if (themeIcon) {
        themeIcon.textContent = currentTheme.isDark ? '☀️' : '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', async () => {
            const currentTheme = await themeService.getCurrentTheme();
            const nextThemeId = currentTheme.id === 'light' ? 'dark' : 'light';
            
            await themeService.setTheme(nextThemeId);

            if (themeIcon) {
                    themeIcon.textContent = nextThemeId === 'dark' ? '☀️' : '🌙';
            }
        });
    }
    const createBtn = document.getElementById('create-theme-btn');
    const modal = document.getElementById('theme-modal');
    const closeBtn = document.getElementById('close-theme-btn');
    const saveBtn = document.getElementById('save-theme-btn');
    
    if (createBtn && modal) {
        createBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const themeNameInput = document.getElementById('theme-name') as HTMLInputElement;
            const themeName = themeNameInput.value.trim();
            
            if (themeName) {
                // Создаем простую тему на основе текущей
                const currentTheme = await themeService.getCurrentTheme();
                const colors = {
                    isDark: currentTheme.isDark
                };
                
                await themeService.createCustomTheme(themeName, colors);
                
                // Закрываем модалку
                if (modal) modal.style.display = 'none';
                themeNameInput.value = '';
                
                alert(`Тема "${themeName}" создана!`);
            }
        });
    }

}

    
document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderSkills();

    initThemeSystem().then(() => {
        console.log('The theme system is loaded');
    }).catch(error => {
        console.error('Error loading themes:', error);
    });


    const burgerButton: HTMLButtonElement | null = document.querySelector('.burger-menu');
    const navMenu: HTMLElement | null = document.querySelector('.nav-menu');
    const navOverlay: HTMLElement | null = document.querySelector('.nav-overlay');
    const body = document.body as HTMLBodyElement;


    if (!burgerButton || !navMenu || !navOverlay) {
        console.error('Not elements menu');
        return;
    }


    

    // открытие закрытие меню
    function toggleMenu(): void {

        if (!navMenu) {
            console.error('navMenu not found in toggleMenu');
            return;
        }

        const isMenuOpen: boolean = navMenu.classList.contains('active');

        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // open menu 
    function openMenu() {

        if (!burgerButton || !navMenu || !navOverlay) return;

        burgerButton.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        body.classList.add('menu-open');

        navOverlay.style.display = 'block';

        disableBodyScroll();
    }

    // close menu 
    function closeMenu() {

        if (!burgerButton || !navMenu || !navOverlay) return;

        burgerButton.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('menu-open');

        enableBodyScroll();

        setTimeout(() => {
            
            if (navOverlay) {
                navOverlay.style.display = 'none';
            }
        }, 300);
    }


    function disableBodyScroll(): void {
        const scrollY: number = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
    }

    // восстановление scroll 

    function enableBodyScroll(): void {
        const scrollY: number = parseInt(body.style.top || '0', 10);
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        window.scrollTo(0, -scrollY);
    }

    // события 
    if (burgerButton) {
        burgerButton.addEventListener('click', toggleMenu);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }  

    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });

    document.addEventListener('keydown', function(event: KeyboardEvent) {
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

            const targetId: string | null = this.getAttribute('href');
            if (!targetId) return;

            const targetElement: HTMLElement | null = document.getElementById(targetId.substring(1));

            if (targetElement) {
                const elementPosition: number = targetElement.offsetTop;
                const offsetPosition: number = elementPosition - 80;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' as ScrollBehavior
                });
            }
        });
    });



    // подсветка раздела

    const section: NodeListOf<HTMLElement> = document.querySelectorAll('section[id]');

    function highlightActiveSection(): void {
        const scrollPosition: number = window.scrollY + 100;

        section.forEach(section => {
            const sectionTop: number = section.offsetTop;
            const sectionHeight: number = section.offsetHeight;
            const sectionId: string | null = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && section) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink: HTMLAnchorElement | null = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    highlightActiveSection();

    window.addEventListener('scroll', highlightActiveSection);

    const contactForm: HTMLFormElement | null = document.getElementById('contactForm') as HTMLFormElement | null;

    if (contactForm) {
        const nameInput: HTMLInputElement = document.getElementById('name') as HTMLInputElement;
        const emailInput: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
        const messageInput: HTMLTextAreaElement = document.getElementById('message') as HTMLTextAreaElement;
        const successMessage: HTMLElement = document.getElementById('successMessage') as HTMLElement;

        function validateForm(): boolean {
            let isValid: boolean = true;

            const nameError: HTMLElement = document.getElementById('nameError') as HTMLElement;
            if (nameInput.value.trim().length < 2) {
                nameError.textContent = 'The name must be at least 2 characters long';
                nameError.style.display = 'block';
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameError.style.display = 'none';
                nameInput.classList.remove('error');
            }

            const emailError: HTMLElement = document.getElementById('emailError') as HTMLElement;
            const email: string = emailInput.value.trim();
            const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                emailError.textContent = 'Enter the correct email address (example@mail.com)';
                emailError.style.display = 'block';
                emailInput.classList.add('error');
                isValid = false;
            } else {
                emailError.style.display = 'none';
                emailInput.classList.remove('error');
            }

            const messageError: HTMLElement = document.getElementById('messageError') as HTMLElement;

            if (messageInput.value.trim().length < 10) {
                messageError.textContent = 'The message must be at least 10 characters long';
                messageError.style.display = 'block';
                messageInput.classList.add('error');
                isValid = false;
            } else {
                messageError.style.display = 'none';
                messageInput.classList.remove('error');
            }

            return isValid;
        }

        contactForm.addEventListener('submit', function(event: SubmitEvent) {
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
            const nameError: HTMLElement = document.getElementById('nameError') as HTMLElement;
            nameError.style.display = 'none';
            nameInput.classList.remove('error');
        });

        emailInput.addEventListener('input', function() {
            const emailError: HTMLElement = document.getElementById('emailError') as HTMLElement;
            emailError.style.display = 'none';
            emailInput.classList.remove('error');
        });

        messageInput.addEventListener('input', function() {
            const messageError: HTMLElement = document.getElementById('messageError') as HTMLElement;
            messageError.style.display = 'none';
            messageInput.classList.remove('error');
        });
    }


    // timer for programm


    function updateCountdown(): void {
        const now: Date = new Date();
        // const nextYear = now.getFullYear() + 1;
        const currentYear: number = now.getFullYear();
        const newYear: Date = new Date(`January 1, ${currentYear + 1} 00:00:00`);
        const difference: number = newYear.getTime() - now.getTime();


        const timerElement: HTMLElement | null = document.getElementById('timer');
        if (!timerElement) return;

        if (difference <= 0) {

            timerElement.textContent = '00:00:00:00';
            return;

        }

        const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours: number = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes: number = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds: number = Math.floor((difference % (1000 * 60)) / 1000);

        timerElement.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateClock(): void {
        const now: Date = new Date();

        const hours: string = now.getHours().toString().padStart(2, '0');
        const minutes: string = now.getMinutes().toString().padStart(2, '0');
        const seconds: string = now.getSeconds().toString().padStart(2, '0');

        const clockElement: HTMLElement | null = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }

    }

    function updateDate(): void {
        const now: Date = new Date();

        const months: string[] = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        const dateElement: HTMLElement | null = document.getElementById('date');
        if (dateElement) {
            dateElement.textContent = `${day} ${month} ${year}`;
        }
    }

    function updateAllDynamicElements(): void {
        updateCountdown();
        updateClock();
        updateDate();
    } 


    setInterval(updateAllDynamicElements, 1000);

    updateAllDynamicElements();

});