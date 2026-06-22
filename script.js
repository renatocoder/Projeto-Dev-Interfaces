// ================================================================
// JIU-JITSU FLOW - SCRIPT PRINCIPAL
// Versão profissional corrigida
// ================================================================

(function() {
    'use strict';

    // ================================================================
    // 1. CONFIGURAÇÃO INICIAL
    // ================================================================

    // Usuário padrão (criado se não existir)
    function seedDefaultUser() {
        const users = JSON.parse(localStorage.getItem('jj_users')) || [];
        if (!users.find(u => u.email === 'adm')) {
            users.push({
                nome: 'Mestre',
                email: 'adm',
                senha: '123456',
                xp: 0,
                faixa: 'Branca'
            });
            localStorage.setItem('jj_users', JSON.stringify(users));
        }
    }
    seedDefaultUser();

    // Estado da aplicação
    let currentUser = JSON.parse(localStorage.getItem('jj_user')) || null;
    let currentPage = 'home';
    let currentVideoTitle = '';

    // ================================================================
    // 2. DADOS
    // ================================================================

    const faixasData = [{
        nome: 'Branca',
        img: 'https://cdn.shopify.com/s/files/1/2776/7470/articles/faixxa_1024x1024.jpg?v=1547833767',
        tempo: '6 meses - 2 anos',
        posicoes: [
            { nome: 'Fechar a Guarda', video: 'https://www.youtube.com/embed/5ByJm5w5v1E' },
            { nome: 'Escapar da Montada', video: 'https://www.youtube.com/embed/8BfXnM4w2kE' },
            { nome: 'Rasteira básica', video: 'https://www.youtube.com/embed/1kXcQ5w9v6E' },
            { nome: 'Manter a Guarda Fechada', video: 'https://www.youtube.com/embed/7bCgN5w3kE' },
            { nome: 'Defesas de finalizações', video: 'https://www.youtube.com/embed/9dXfN5w4kE' }
        ]
    }, {
        nome: 'Azul',
        img: 'https://images.tcdn.com.br/img/editor/up/860336/paraserumbomfaixaazuldejiujitsumeukimono.jpg',
        tempo: '2 - 4 anos',
        posicoes: [
            { nome: 'Guarda Aberta (DLR)', video: 'https://www.youtube.com/embed/6pQe1e3mNQo' },
            { nome: 'Passagem de guarda', video: 'https://www.youtube.com/embed/3xRnM4w2kE' },
            { nome: 'Raspagem (sweep)', video: 'https://www.youtube.com/embed/2sCgN-6oLpI' },
            { nome: 'Mata-leão', video: 'https://www.youtube.com/embed/4xBfN5w4kE' },
            { nome: 'Montada com controle', video: 'https://www.youtube.com/embed/5xCnM6w4kE' }
        ]
    }, {
        nome: 'Roxa',
        img: 'https://pratiquefitness.com.br/wp-content/uploads/2019/07/Tudo-sobre-o-jiu-jitsu-faixa-roxa-1.jpg',
        tempo: '3 - 5 anos',
        posicoes: [
            { nome: 'Guarda Spider', video: 'https://www.youtube.com/embed/7xBfM7w4kE' },
            { nome: 'Meia-guarda profunda', video: 'https://www.youtube.com/embed/8yBfN8w4kE' },
            { nome: 'Berimbolo', video: 'https://www.youtube.com/embed/9zBfN9w4kE' },
            { nome: 'Chave de braço do topo', video: 'https://www.youtube.com/embed/0aBfN0w4kE' },
            { nome: 'Transições fluidas', video: 'https://www.youtube.com/embed/1bBfN1w4kE' }
        ]
    }, {
        nome: 'Marrom',
        img: 'https://pratiquefitness.com.br/wp-content/uploads/2019/07/Tudo-sobre-o-jiu-jitsu-faixa-marrom-2.jpg',
        tempo: '1 - 2 anos (pós-roxa)',
        posicoes: [
            { nome: 'Tesoura de mão', video: 'https://www.youtube.com/embed/2cBfN2w4kE' },
            { nome: 'Tornozeleira', video: 'https://www.youtube.com/embed/3dBfN3w4kE' },
            { nome: 'Americana / Omoplata', video: 'https://www.youtube.com/embed/4eBfN4w4kE' },
            { nome: 'Passagem flutuante', video: 'https://www.youtube.com/embed/5fBfN5w4kE' },
            { nome: 'Ataques pelas costas', video: 'https://www.youtube.com/embed/6gBfN6w4kE' }
        ]
    }, {
        nome: 'Preta',
        img: 'http://www.graciemag.com/wp-content/uploads/2017/01/Amarrando-faixa-preta-Foto-Araga-1.jpg',
        tempo: '10+ anos',
        posicoes: [
            { nome: 'Guarda 50/50', video: 'https://www.youtube.com/embed/7hBfN7w4kE' },
            { nome: 'Chave cruzada de baixo', video: 'https://www.youtube.com/embed/8iBfN8w4kE' },
            { nome: 'Joelho na barriga', video: 'https://www.youtube.com/embed/9jBfN9w4kE' },
            { nome: 'Smash pass', video: 'https://www.youtube.com/embed/0kBfN0w4kE' },
            { nome: 'Heel Hook', video: 'https://www.youtube.com/embed/1lBfN1w4kE' }
        ]
    }];

    const faixaLevels = [
        { nome: 'Branca', xpMin: 0 },
        { nome: 'Azul', xpMin: 100 },
        { nome: 'Roxa', xpMin: 300 },
        { nome: 'Marrom', xpMin: 600 },
        { nome: 'Preta', xpMin: 1000 }
    ];

    // ================================================================
    // 3. DOM REFS (inicializados após o DOM carregar)
    // ================================================================

    let navLinks, appMain, menuToggle, themeToggle;
    let videoModal, closeModal, videoIframe, videoTitle;
    let focusModeBtn, xpGainBtn;

    function initDOMRefs() {
        navLinks = document.getElementById('navLinks');
        appMain = document.getElementById('appMain');
        menuToggle = document.getElementById('menuToggle');
        themeToggle = document.getElementById('themeToggle');
        videoModal = document.getElementById('videoModal');
        closeModal = document.getElementById('closeModal');
        videoIframe = document.getElementById('videoIframe');
        videoTitle = document.getElementById('videoTitle');
        focusModeBtn = document.getElementById('focusModeBtn');
        xpGainBtn = document.getElementById('xpGainBtn');
    }

    // ================================================================
    // 4. PARTÍCULAS (Canvas)
    // ================================================================

    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const count = 80;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.r = Math.random() * 3 + 1;
                this.dx = (Math.random() - 0.5) * 0.8;
                this.dy = (Math.random() - 0.5) * 0.8;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.dx;
                this.y += this.dy;
                if (this.x < 0 || this.x > w) this.dx *= -1;
                if (this.y < 0 || this.y > h) this.dy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(230, 126, 34, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update();
                p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(230, 126, 34, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ================================================================
    // 5. HELPERS
    // ================================================================

    function render(html) {
        if (appMain) appMain.innerHTML = html;
    }

    function showMessage(type, msg) {
        const el = document.getElementById('authMsg');
        if (!el) return;
        el.className = `msg-${type}`;
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 5000);
    }

    function getXP() {
        if (!currentUser) return 0;
        const users = JSON.parse(localStorage.getItem('jj_users')) || [];
        const user = users.find(u => u.email === currentUser.email);
        return user ? user.xp || 0 : 0;
    }

    function setXP(newXP) {
        if (!currentUser) return;
        const users = JSON.parse(localStorage.getItem('jj_users')) || [];
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) {
            users[idx].xp = Math.max(0, newXP);
            let newFaixa = 'Branca';
            for (let f of faixaLevels) {
                if (users[idx].xp >= f.xpMin) newFaixa = f.nome;
            }
            users[idx].faixa = newFaixa;
            localStorage.setItem('jj_users', JSON.stringify(users));
            currentUser = { ...users[idx] };
            localStorage.setItem('jj_user', JSON.stringify(currentUser));
            updateXPBar();
        }
    }

    function addXP(amount) {
        const current = getXP();
        setXP(current + amount);
    }

    function updateXPBar() {
        const fill = document.querySelector('.xp-bar-fill');
        const text = document.querySelector('.xp-text');
        if (!fill || !text) return;
        const xp = getXP();
        const maxXP = 1100;
        const pct = Math.min(100, (xp / maxXP) * 100);
        fill.style.width = pct + '%';
        const faixa = currentUser?.faixa || 'Branca';
        text.textContent = `⚡ ${xp} XP · ${faixa}`;
    }

    function getFaixaByXP(xp) {
        let faixa = 'Branca';
        for (let f of faixaLevels) {
            if (xp >= f.xpMin) faixa = f.nome;
        }
        return faixa;
    }

    // ================================================================
    // 6. PÁGINAS (HTML)
    // ================================================================

    function pageLogin() {
        return `
            <div class="auth-page">
                <div class="auth-card">
                    <h2>🔐 Acesse sua conta</h2>
                    <p class="subtitle">Use <strong>adm</strong> / <strong>123456</strong> ou crie uma conta</p>
                    <div id="authMsg" class="msg-error"></div>
                    <form id="loginForm" novalidate>
                        <label for="loginEmail">E-mail</label>
                        <input type="text" id="loginEmail" placeholder="adm" value="adm" autofocus>
                        <label for="loginSenha">Senha</label>
                        <input type="password" id="loginSenha" placeholder="••••••••" value="123456">
                        <button type="submit" class="btn-primary">Entrar</button>
                    </form>
                    <div class="auth-switch">
                        Não tem conta? <a id="goToCadastro">Crie uma agora</a>
                    </div>
                </div>
            </div>
        `;
    }

    function pageCadastro() {
        return `
            <div class="auth-page">
                <div class="auth-card">
                    <h2>📝 Criar conta</h2>
                    <p class="subtitle">Comece sua jornada no Jiu‑Jitsu Flow</p>
                    <div id="authMsg" class="msg-error"></div>
                    <form id="cadastroForm" novalidate>
                        <label for="cadNome">Nome completo</label>
                        <input type="text" id="cadNome" placeholder="Seu nome" required autofocus>
                        <label for="cadEmail">E-mail</label>
                        <input type="email" id="cadEmail" placeholder="seu@email.com" required>
                        <label for="cadSenha">Senha (mínimo 6)</label>
                        <input type="password" id="cadSenha" placeholder="••••••••" required minlength="6">
                        <label for="cadConfirma">Confirme a senha</label>
                        <input type="password" id="cadConfirma" placeholder="••••••••" required minlength="6">
                        <button type="submit" class="btn-primary">Criar conta</button>
                    </form>
                    <div class="auth-switch">
                        Já tem conta? <a id="goToLogin">Faça login</a>
                    </div>
                </div>
            </div>
        `;
    }

    function pageHome() {
        const xp = getXP();
        const faixa = getFaixaByXP(xp);
        return `
            <div class="hero-banner">
                <h1>Arte Suave, <span>Flow Forte</span></h1>
                <p>Bem-vindo, <strong>${currentUser?.nome || 'Campeão'}!</strong> 🥋</p>
                <div class="xp-bar-container">
                    <span class="xp-text">⚡ ${xp} XP · ${faixa}</span>
                    <div class="xp-bar">
                        <div class="xp-bar-fill" style="width:${Math.min(100, (xp/1100)*100)}%"></div>
                    </div>
                </div>
            </div>
            <h2 class="page-title">📖 O que é Jiu‑Jitsu Flow?</h2>
            <div class="intro-text">
                <p style="margin-bottom:0.8rem;">
                    <strong>Jiu‑Jitsu Flow</strong> é mais que uma arte marcial – é um estado de espírito. 
                    A técnica supera a força, a fluidez supera a rigidez. 
                    Cada posição, cada transição, é uma dança estratégica.
                </p>
                <p>
                    Neste espaço, você evolui assistindo técnicas, respondendo perguntas e 
                    acumulando <strong>XP</strong> para desbloquear novas faixas. 
                    Treine sua mente, domine seu corpo.
                </p>
            </div>
            <div class="quote-block">
                "A suavidade supera a dureza" – Princípio do Jiu‑Jitsu
            </div>
            <div style="margin-top:2.5rem; display:flex; justify-content:center;">
                <img src="https://grapplinginsider.com/wp-content/uploads/2022/05/graciefamily.jpg" 
                     alt="Família Gracie" 
                     style="width:100%; max-width:600px; border-radius:var(--radius); box-shadow:var(--shadow);">
            </div>
        `;
    }

    function pageFaixas() {
        const carouselImages = [
            'https://wallpapers.com/images/hd/brazilian-jiu-jitsu-rolling-position-ai5ygss995dwibrq.jpg',
            'https://i.pinimg.com/originals/ba/51/71/ba5171b6181c0b9d209dc380dec55308.jpg',
            'https://th.bing.com/th/id/OIP.f5AhznUhhn--9HhneUOY4gHaE1?w=279&h=182&c=7&r=0&o=7&pid=1.7&rm=3'
        ];

        let slidesHTML = carouselImages.map((img, i) =>
            `<div class="carousel-slide"><img src="${img}" alt="Slide ${i+1}" loading="lazy"></div>`
        ).join('');

        let dotsHTML = carouselImages.map((_, i) =>
            `<span class="dot ${i===0?'active':''}" data-index="${i}"></span>`
        ).join('');

        let cardsHTML = faixasData.map(faixa => {
            let posicoesHTML = faixa.posicoes.map((p) =>
                `<li data-video="${p.video}" data-title="${faixa.nome} - ${p.nome}">
                            ${p.nome}
                            <span class="play-icon">▶</span>
                        </li>`
            ).join('');
            return `
                    <div class="card-item">
                        <img src="${faixa.img}" alt="Faixa ${faixa.nome}" class="faixa-img">
                        <h3>Faixa ${faixa.nome}</h3>
                        <span class="tempo">⏱ ${faixa.tempo}</span>
                        <ul>${posicoesHTML}</ul>
                    </div>
                `;
        }).join('');

        return `
                <h2 class="page-title">🥋 Sistema de Graduação</h2>
                <p style="margin-bottom:1rem;">Clique no ícone ▶ ao lado de cada posição para assistir ao vídeo e ganhar <strong>XP</strong>.</p>

                <div class="carousel-container" id="carousel">
                    <div class="carousel-slides" id="carouselSlides">${slidesHTML}</div>
                    <button class="carousel-btn prev" id="carouselPrev">‹</button>
                    <button class="carousel-btn next" id="carouselNext">›</button>
                    <div class="carousel-indicators" id="carouselIndicators">${dotsHTML}</div>
                </div>

                <div class="card-grid">${cardsHTML}</div>
            `;
    }

    function pagePromocao() {
        const xp = getXP();
        return `
                <h2 class="page-title">🔄 Troca de Faixa</h2>
                <div class="promo-box">
                    <div>
                        <h3>📋 Critérios de Promoção</h3>
                        <ul>
                            <li><strong>Frequência</strong> – Assiduidade nos treinos</li>
                            <li><strong>Conhecimento</strong> – Domínio das técnicas da faixa atual</li>
                            <li><strong>Contribuição</strong> – Ajudar os colegas e manter o respeito</li>
                            <li><strong>Avaliação do Professor</strong> – Análise contínua do desempenho</li>
                            <li><strong>Tempo mínimo</strong> – Respeitando as regras da IBJJF</li>
                        </ul>
                        <div class="dica">
                            💡 <strong>Dica:</strong> A troca não é apenas sobre tempo, mas sobre <strong>maturidade técnica e mental</strong>.
                        </div>
                    </div>
                    <div>
                        <h3>⏳ Tempos Mínimos (IBJJF)</h3>
                        <ul>
                            <li>Branca → Azul: <strong>2 anos</strong></li>
                            <li>Azul → Roxa: <strong>2 anos</strong></li>
                            <li>Roxa → Marrom: <strong>1,5 anos</strong></li>
                            <li>Marrom → Preta: <strong>1 ano</strong></li>
                            <li style="margin-top:1rem; border-top:1px solid var(--accent); padding-top:0.5rem;">
                                ⭐ Faixa preta: <strong>mínimo 10 anos</strong> de treino contínuo.
                            </li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top:2rem; background:var(--bg-card); padding:1.8rem; border-radius:var(--radius); border:1px solid var(--border);">
                    <h3 style="color:var(--accent);">🎯 Seu progresso atual</h3>
                    <p style="margin-top:0.5rem;">XP: <strong>${xp}</strong> · Faixa: <strong>${getFaixaByXP(xp)}</strong></p>
                    <p style="font-size:0.9rem; color:var(--text-secondary);">
                        ${xp < 100 ? 'Faltam ' + (100 - xp) + ' XP para a faixa Azul.' :
                          xp < 300 ? 'Faltam ' + (300 - xp) + ' XP para a faixa Roxa.' :
                          xp < 600 ? 'Faltam ' + (600 - xp) + ' XP para a faixa Marrom.' :
                          xp < 1000 ? 'Faltam ' + (1000 - xp) + ' XP para a faixa Preta.' :
                          '🔥 Você já é faixa Preta! Continue evoluindo.'}
                    </p>
                </div>
            `;
    }

    function pageBeneficios() {
        const beneficios = [
            { emoji: '💪', titulo: 'Condicionamento', desc: 'Força, resistência e flexibilidade' },
            { emoji: '🧠', titulo: 'Disciplina Mental', desc: 'Foco, paciência e controle emocional' },
            { emoji: '🛡️', titulo: 'Defesa Pessoal', desc: 'Técnicas reais para situações de risco' },
            { emoji: '🤝', titulo: 'Comunidade', desc: 'Amizades, respeito e hierarquia' },
            { emoji: '😌', titulo: 'Redução de Estresse', desc: 'Alivia ansiedade e melhora o sono' },
            { emoji: '🧩', titulo: 'Resolução de Problemas', desc: 'Pensamento rápido e estratégico' },
            { emoji: '⚡', titulo: 'Flow State', desc: 'Conexão mente-corpo em movimento' },
        ];
        let itemsHTML = beneficios.map(b =>
            `<div class="benefit-item"><span class="emoji">${b.emoji}</span><h3>${b.titulo}</h3><p>${b.desc}</p></div>`
        ).join('');
        return `
                <h2 class="page-title">✅ Benefícios do Jiu‑Jitsu Flow</h2>
                <div class="benefits-grid">${itemsHTML}</div>
                <div class="btn-center">
                    <a href="https://www.atletis.com.br/jiu-jitsu" target="_blank" class="btn-link">
                        Quero saber mais →
                    </a>
                </div>
            `;
    }

    // ================================================================
    // 7. ROTEADOR
    // ================================================================

    function navigate(page) {
        currentPage = page;
        if (!currentUser && page !== 'login' && page !== 'cadastro') {
            page = 'login';
            currentPage = 'login';
        }

        let html = '';
        switch (page) {
            case 'login':
                html = pageLogin();
                break;
            case 'cadastro':
                html = pageCadastro();
                break;
            case 'home':
                html = pageHome();
                break;
            case 'faixas':
                html = pageFaixas();
                break;
            case 'promocao':
                html = pagePromocao();
                break;
            case 'beneficios':
                html = pageBeneficios();
                break;
            default:
                html = pageHome();
        }
        render(html);

        // Aguarda o DOM ser atualizado para anexar eventos
        requestAnimationFrame(() => {
            updateNav();
            attachEvents(page);

            if (page === 'faixas') {
                initCarousel();
                attachVideoEvents();
            }
            if (page === 'home' || page === 'promocao') {
                updateXPBar();
            }
        });
    }

    // ================================================================
    // 8. CARROSSEL
    // ================================================================

    let currentSlide = 0;
    let totalSlides = 0;
    let autoPlayInterval = null;

    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const slidesContainer = document.getElementById('carouselSlides');

        if (!slides.length || !slidesContainer) return;

        totalSlides = slides.length;
        currentSlide = 0;

        function goTo(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            indicators.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        // Remove eventos antigos para evitar duplicação
        const newPrev = prevBtn?.cloneNode(true);
        const newNext = nextBtn?.cloneNode(true);
        if (prevBtn && newPrev) {
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);
            newPrev.addEventListener('click', () => { goTo(currentSlide - 1);
                resetAuto(); });
        }
        if (nextBtn && newNext) {
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            newNext.addEventListener('click', () => { goTo(currentSlide + 1);
                resetAuto(); });
        }

        indicators.forEach((dot, i) => {
            dot.removeEventListener('click', dot._clickHandler);
            dot._clickHandler = () => { goTo(i);
                resetAuto(); };
            dot.addEventListener('click', dot._clickHandler);
        });

        function startAuto() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => goTo(currentSlide + 1), 4000);
        }

        function resetAuto() { startAuto(); }

        const container = document.getElementById('carousel');
        if (container) {
            container.removeEventListener('mouseenter', container._mouseEnter);
            container.removeEventListener('mouseleave', container._mouseLeave);
            container._mouseEnter = () => { if (autoPlayInterval) clearInterval(autoPlayInterval); };
            container._mouseLeave = startAuto;
            container.addEventListener('mouseenter', container._mouseEnter);
            container.addEventListener('mouseleave', container._mouseLeave);
        }

        startAuto();
        goTo(0);
    }

    // ================================================================
    // 9. VÍDEOS E MODAL
    // ================================================================

    function openVideo(url, title) {
        currentVideoTitle = title;
        if (videoIframe) videoIframe.src = url;
        if (videoTitle) videoTitle.textContent = title;
        if (videoModal) {
            videoModal.classList.remove('focus-mode');
            videoModal.classList.add('open');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        if (videoModal) {
            videoModal.classList.remove('open', 'focus-mode');
        }
        if (videoIframe) videoIframe.src = '';
        document.body.style.overflow = '';
    }

    function toggleFocusMode() {
        if (videoModal) videoModal.classList.toggle('focus-mode');
    }

    function gainXPFromVideo() {
        addXP(10);
        if (xpGainBtn) {
            xpGainBtn.textContent = '✅ +10 XP ganho!';
            xpGainBtn.style.background = '#27ae60';
            setTimeout(() => {
                xpGainBtn.textContent = '+10 XP ao assistir';
                xpGainBtn.style.background = '';
            }, 2000);
        }
        updateXPBar();
        const faixaAtual = getFaixaByXP(getXP());
        if (videoTitle) {
            videoTitle.textContent = `${currentVideoTitle} (${faixaAtual})`;
        }
    }

    function attachVideoEvents() {
        document.querySelectorAll('.card-item ul li[data-video]').forEach(item => {
            item.removeEventListener('click', item._clickHandler);
            item._clickHandler = () => {
                const url = item.dataset.video;
                const title = item.dataset.title;
                openVideo(url, title);
            };
            item.addEventListener('click', item._clickHandler);
        });
    }

    // ================================================================
    // 10. MENU DE NAVEGAÇÃO
    // ================================================================

    function updateNav() {
        if (!navLinks) return;

        if (currentUser) {
            navLinks.innerHTML = `
                    <li><a href="#" data-page="home" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
                    <li><a href="#" data-page="faixas" class="${currentPage === 'faixas' ? 'active' : ''}">Faixas</a></li>
                    <li><a href="#" data-page="promocao" class="${currentPage === 'promocao' ? 'active' : ''}">Promoção</a></li>
                    <li><a href="#" data-page="beneficios" class="${currentPage === 'beneficios' ? 'active' : ''}">Benefícios</a></li>
                    <li><button class="btn-logout" id="logoutBtn">Sair</button></li>
                `;
            navLinks.querySelectorAll('[data-page]').forEach(link => {
                link.removeEventListener('click', link._clickHandler);
                link._clickHandler = (e) => {
                    e.preventDefault();
                    navigate(link.dataset.page);
                    if (navLinks) navLinks.classList.remove('open');
                };
                link.addEventListener('click', link._clickHandler);
            });
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.removeEventListener('click', logoutBtn._clickHandler);
                logoutBtn._clickHandler = logout;
                logoutBtn.addEventListener('click', logoutBtn._clickHandler);
            }
        } else {
            navLinks.innerHTML = `
                    <li><a href="#" data-page="login" class="${currentPage === 'login' ? 'active' : ''}">Login</a></li>
                    <li><a href="#" data-page="cadastro" class="${currentPage === 'cadastro' ? 'active' : ''}">Cadastro</a></li>
                `;
            navLinks.querySelectorAll('[data-page]').forEach(link => {
                link.removeEventListener('click', link._clickHandler);
                link._clickHandler = (e) => {
                    e.preventDefault();
                    navigate(link.dataset.page);
                    if (navLinks) navLinks.classList.remove('open');
                };
                link.addEventListener('click', link._clickHandler);
            });
        }
    }

    // ================================================================
    // 11. AUTENTICAÇÃO
    // ================================================================

    function login(email, senha) {
        const users = JSON.parse(localStorage.getItem('jj_users')) || [];
        const user = users.find(u => u.email === email && u.senha === senha);
        if (!user) {
            showMessage('error', 'E-mail ou senha inválidos.');
            return false;
        }
        currentUser = { ...user };
        localStorage.setItem('jj_user', JSON.stringify(currentUser));
        navigate('home');
        return true;
    }

    function cadastro(nome, email, senha, confirma) {
        if (senha !== confirma) {
            showMessage('error', 'Senhas não coincidem.');
            return false;
        }
        if (senha.length < 6) {
            showMessage('error', 'Senha deve ter 6+ caracteres.');
            return false;
        }
        const users = JSON.parse(localStorage.getItem('jj_users')) || [];
        if (users.find(u => u.email === email)) {
            showMessage('error', 'E-mail já cadastrado.');
            return false;
        }
        users.push({ nome, email, senha, xp: 0, faixa: 'Branca' });
        localStorage.setItem('jj_users', JSON.stringify(users));
        showMessage('success', 'Conta criada! Faça login.');
        navigate('login');
        return true;
    }

    function logout() {
        localStorage.removeItem('jj_user');
        currentUser = null;
        navigate('login');
    }

    // ================================================================
    // 12. EVENTOS ESPECÍFICOS
    // ================================================================

    function attachEvents(page) {
        // Menu hamburger
        if (menuToggle) {
            menuToggle.removeEventListener('click', menuToggle._clickHandler);
            menuToggle._clickHandler = () => {
                if (navLinks) navLinks.classList.toggle('open');
            };
            menuToggle.addEventListener('click', menuToggle._clickHandler);
        }

        // Login
        if (page === 'login') {
            const form = document.getElementById('loginForm');
            if (form) {
                form.removeEventListener('submit', form._submitHandler);
                form._submitHandler = (e) => {
                    e.preventDefault();
                    const email = document.getElementById('loginEmail')?.value.trim() || '';
                    const senha = document.getElementById('loginSenha')?.value.trim() || '';
                    login(email, senha);
                };
                form.addEventListener('submit', form._submitHandler);
            }
            const goCad = document.getElementById('goToCadastro');
            if (goCad) {
                goCad.removeEventListener('click', goCad._clickHandler);
                goCad._clickHandler = () => navigate('cadastro');
                goCad.addEventListener('click', goCad._clickHandler);
            }
        }

        // Cadastro
        if (page === 'cadastro') {
            const form = document.getElementById('cadastroForm');
            if (form) {
                form.removeEventListener('submit', form._submitHandler);
                form._submitHandler = (e) => {
                    e.preventDefault();
                    const nome = document.getElementById('cadNome')?.value.trim() || '';
                    const email = document.getElementById('cadEmail')?.value.trim() || '';
                    const senha = document.getElementById('cadSenha')?.value.trim() || '';
                    const confirma = document.getElementById('cadConfirma')?.value.trim() || '';
                    cadastro(nome, email, senha, confirma);
                };
                form.addEventListener('submit', form._submitHandler);
            }
            const goLogin = document.getElementById('goToLogin');
            if (goLogin) {
                goLogin.removeEventListener('click', goLogin._clickHandler);
                goLogin._clickHandler = () => navigate('login');
                goLogin.addEventListener('click', goLogin._clickHandler);
            }
        }
    }

    // ================================================================
    // 13. TEMA ESCURO/CLARO
    // ================================================================

    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        if (themeToggle) {
            themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('jj_theme', next);
    }

    function loadTheme() {
        const saved = localStorage.getItem('jj_theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        if (themeToggle) {
            themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
        }
    }

    // ================================================================
    // 14. INICIALIZAÇÃO (MODULAR E SEGURA)
    // ================================================================

    function initApp() {
        // 1. Inicializa DOM refs
        initDOMRefs();

        // 2. Carrega tema
        loadTheme();

        // 3. Inicializa partículas
        initParticles();

        // 4. Configura eventos do tema
        if (themeToggle) {
            themeToggle.removeEventListener('click', themeToggle._clickHandler);
            themeToggle._clickHandler = toggleTheme;
            themeToggle.addEventListener('click', themeToggle._clickHandler);
        }

        // 5. Configura eventos do modal
        if (closeModal) {
            closeModal.removeEventListener('click', closeModal._clickHandler);
            closeModal._clickHandler = closeVideo;
            closeModal.addEventListener('click', closeModal._clickHandler);
        }

        if (videoModal) {
            videoModal.removeEventListener('click', videoModal._clickHandler);
            videoModal._clickHandler = (e) => {
                if (e.target === videoModal) closeVideo();
            };
            videoModal.addEventListener('click', videoModal._clickHandler);
        }

        document.removeEventListener('keydown', document._keydownHandler);
        document._keydownHandler = (e) => {
            if (e.key === 'Escape') closeVideo();
        };
        document.addEventListener('keydown', document._keydownHandler);

        if (focusModeBtn) {
            focusModeBtn.removeEventListener('click', focusModeBtn._clickHandler);
            focusModeBtn._clickHandler = toggleFocusMode;
            focusModeBtn.addEventListener('click', focusModeBtn._clickHandler);
        }

        if (xpGainBtn) {
            xpGainBtn.removeEventListener('click', xpGainBtn._clickHandler);
            xpGainBtn._clickHandler = gainXPFromVideo;
            xpGainBtn.addEventListener('click', xpGainBtn._clickHandler);
        }

        // 6. Navegação inicial
        if (currentUser) {
            navigate('home');
        } else {
            navigate('login');
        }
    }

    // ================================================================
    // 15. INICIALIZAÇÃO SEGURA (aguarda DOM)
    // ================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})();
