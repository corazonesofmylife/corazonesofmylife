/**
 * SCRIPT.JS - Corazones of My Life
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CARGA DE COMPONENTES (Menú y Footer) ---
    function loadComponent(id, file) {
        return fetch(file)
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar ${file}`);
                return response.text();
            })
            .then(data => {
                document.getElementById(id).innerHTML = data;

                if (id === 'menu-placeholder') {
                    highlightActiveLink();
                    initMobileMenu();
                }
            })
            .catch(error => console.error('Error de componentes:', error));
    }

    loadComponent('menu-placeholder', 'menu.html');
    loadComponent('footer-placeholder', 'footer.html');

    function highlightActiveLink() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // --- 2. LÓGICA DEL MENÚ MÓVIL ---
    function initMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav');

        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                menuBtn.classList.toggle('active');

                const icon = menuBtn.querySelector('i');
                if (icon) {
                    if (navMenu.classList.contains('active')) {
                        icon.classList.replace('fa-bars', 'fa-times');
                    } else {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });

            const links = navMenu.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if (icon) icon.classList.replace('fa-times', 'fa-bars');
                });
            });
        }
    }

    // --- 3. ANIMACIONES AL HACER SCROLL ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 4. LÓGICA ESPECIAL DEL VIDEO (QUIÉNES SOMOS) ---
    const videoElem = document.getElementById('mainVideo');
    if (videoElem) {
        videoElem.addEventListener('mouseenter', () => {
            videoElem.style.transform = 'translateY(-10px) scale(1.02)';
            videoElem.style.boxShadow = '0 35px 70px rgba(10, 25, 47, 0.4)';
        });
        videoElem.addEventListener('mouseleave', () => {
            videoElem.style.transform = 'translateY(0) scale(1)';
            videoElem.style.boxShadow = '0 30px 60px rgba(10, 25, 47, 0.2)';
        });
    }

    // --- 5. EFECTO DE AGUA (PIXIJS) ---
    function initWaterEffect() {
        const container = document.getElementById('water-canvas-container');
        if (!container) return;

        const app = new PIXI.Application({
            width: container.offsetWidth,
            height: container.offsetHeight,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            transparent: true
        });
        container.appendChild(app.view);

        app.loader
            .add('fondo', 'img/fondo-hogar.jpg')
            .add('mapa', 'https://res.cloudinary.com/dgksx9vhd/image/upload/v1686751235/displacement_map_repeat_v6yv9z.jpg')
            .load((loader, resources) => {
                const sprite = new PIXI.Sprite(resources.fondo.texture);
                sprite.anchor.set(0.5);
                sprite.x = app.screen.width / 2;
                sprite.y = app.screen.height / 2;

                const resize = () => {
                    const scale = Math.max(app.screen.width / sprite.texture.width, app.screen.height / sprite.texture.height);
                    sprite.scale.set(scale);
                };
                resize();
                app.stage.addChild(sprite);

                const displacementSprite = new PIXI.Sprite(resources.mapa.texture);
                displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

                app.stage.addChild(displacementSprite);
                sprite.filters = [displacementFilter];

                app.ticker.add(() => {
                    displacementSprite.x += 1;
                    displacementSprite.y += 0.8;
                });

                window.addEventListener('mousemove', (e) => {
                    displacementFilter.scale.x = (e.clientX - app.screen.width / 2) / 20;
                    displacementFilter.scale.y = (e.clientY - app.screen.height / 2) / 20;
                });

                window.addEventListener('resize', () => {
                    app.renderer.resize(container.offsetWidth, container.offsetHeight);
                    sprite.x = app.screen.width / 2;
                    sprite.y = app.screen.height / 2;
                    resize();
                });
            });
    }

    setTimeout(initWaterEffect, 400);
});

// --- FUNCIÓN GLOBAL PARA EL BOTÓN DE AUDIO ---
// Se coloca afuera para que el onclick="playVideoWithAudio()" del HTML la encuentre
function playVideoWithAudio() {
    const iframe = document.getElementById('ytPlayer');
    if (iframe) {
        const currentSrc = iframe.src;
        // Cambia mute=1 por mute=0
        iframe.src = currentSrc.replace("mute=1", "mute=0");

        const btn = document.querySelector('.btn-play-video-alt');
        if (btn) {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => {
                btn.style.display = 'none';
            }, 400);
        }
    }
}

