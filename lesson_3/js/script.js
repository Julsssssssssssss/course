// console.log("work js");

document.addEventListener('DOMContentLoaded', function() {
    // делаем прокрутку
    const navLinks = document.querySelectorAll('nav a');

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

                // targetElement.scrollIntoView({
                //     behavior: 'smooth',
                //     block: 'start'
                // });
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

});