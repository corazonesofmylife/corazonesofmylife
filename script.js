// ============================================
// CORAZONES OF MY LIFE - JAVASCRIPT
// Mejoras de interactividad y animaciones
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL PARA ENLACES ANCLA
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER PARA ANIMACIONES
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tarjetas de valores
    document.querySelectorAll('.value-card').forEach(card => {
        observer.observe(card);
    });

    // Observar tarjetas de servicios
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Observar items de valores detallados
    document.querySelectorAll('.value-item').forEach(item => {
        observer.observe(item);
    });

    // ============================================
    // VALIDACIÓN DE FORMULARIO
    // ============================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const formGroups = contactForm.querySelectorAll('.form-group');

            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                const errorMsg = group.querySelector('.error-message');

                if (input && input.hasAttribute('required')) {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        if (errorMsg) {
                            errorMsg.classList.add('show');
                            errorMsg.textContent = 'Este campo es obligatorio';
                        }
                    } else {
                        input.classList.remove('error');
                        if (errorMsg) {
                            errorMsg.classList.remove('show');
                        }
                    }

                    // Validar email
                    if (input.type === 'email' && input.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            if (errorMsg) {
                                errorMsg.textContent = 'Por favor ingresa un email válido';
                                errorMsg.classList.add('show');
                            }
                        }
                    }
                }
            });

            if (isValid) {
                // Mostrar mensaje de éxito
                showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                contactForm.reset();
            } else {
                showNotification('Por favor completa todos los campos requeridos correctamente.', 'error');
            }
        });

        // Limpiar errores al escribir
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.closest('.form-group').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('show');
                }
            });
        });
    }

    // ============================================
    // NOTIFICACIONES
    // ============================================
    function showNotification(message, type = 'success') {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#e74c3c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Agregar animaciones CSS para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // EFECTOS DE HOVER MEJORADOS
    // ============================================
    // Agregar efecto de ondas en botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Agregar animación de ripple
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ============================================
    // LAZY LOADING PARA IMÁGENES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // CONTADOR ANIMADO (si hay números para mostrar)
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // ============================================
    // MEJORAR ACCESIBILIDAD
    // ============================================
    // Agregar soporte para teclado en tarjetas
    document.querySelectorAll('.value-card, .service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });

    // ============================================
    // PREVENIR ENVÍO DUPLICADO DE FORMULARIO
    // ============================================
    if (contactForm) {
        let isSubmitting = false;
        const originalSubmit = contactForm.onsubmit;

        contactForm.addEventListener('submit', function(e) {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
            isSubmitting = true;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            // Simular envío (reemplazar con lógica real)
            setTimeout(() => {
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                }
            }, 2000);
        });
    }

    // ============================================
    // MEJORAR NAVEGACIÓN MOBILE
    // ============================================
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');

    if (window.innerWidth <= 768 && navList) {
        // Crear botón de menú móvil
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-primary);
            padding: 0.5rem;
        `;

        if (nav) {
            nav.insertBefore(menuToggle, navList);
        }

        // Toggle menú en móvil
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('mobile-open');
        });

        // Cerrar menú al hacer clic en un enlace
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('mobile-open');
            });
        });
    }

    // ============================================
    // EFECTO PARALLAX SUAVE EN HERO
    // ============================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            const heroImage = hero.querySelector('.hero-image');

            if (heroContent && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            if (heroImage && scrolled < hero.offsetHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        });
    }

    // ============================================
    // AGREGAR CLASE DE CARGA COMPLETA
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    console.log('✅ Corazones of My Life - JavaScript cargado correctamente');
});

