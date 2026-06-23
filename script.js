/**
 * Jiu-Jitsu Pro - JavaScript
 * SPA com autenticação, modo escuro, carrossel e vídeos interativos
 * @version 2.0
 */

// ==================================================
// 1. CONFIGURAÇÕES INICIAIS
// ==================================================

// Criar usuário padrão se não existir
(function seedDefaultUser() {
    const users = JSON.parse(localStorage.getItem('jj_users')) || [];
    if (!users.find(u => u.email === 'adm')) {
        users.push({ nome: 'Administrador', email: 'adm', senha: '123456' });
        localStorage.setItem('jj_users', JSON.stringify(users));
    }
})();

let currentUser = JSON.parse(localStorage.getItem('jj_user')) || null;
let currentPage = 'home';

// ==================================================
// 2. DADOS DAS FAIXAS COM VÍDEOS
// ==================================================
// Cada posição tem um videoId do YouTube (embed)
// Substitua pelos vídeos reais que desejar
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

// ==================================================
// 3. DOM REFS
// ==================================================
const navLinks = document.getElementById('navLinks');
const appMain = document.getElementById('appMain');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const videoIframe = document.getElementById('videoIframe');
const videoTitle = document.getElementById('videoTitle');

// ==================================================
// 4. HELPERS
// ==================================================

/**
 * Renderiza o HTML no main
 */
function render(html) {
    appMain.innerHTML = html;
}

/**
 * Exibe mensagem de feedback (erro/sucesso)
 */
function showMessage(type, msg) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.className = `msg-${type}`;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

/**
 * Abre o modal de vídeo
 */
function openVideo(url, title) {
    videoIframe.src = url;
    videoTitle.textContent = title;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de vídeo
 */
function closeVideo() {
    videoModal.classList.remove('open');
    videoIframe.src = '';
    document.body.style.overflow = '';
}

// ==================================================
// 5. PÁGINAS (HTML)
// ==================================================

/**
 * Página de Login
 */
function pageLogin() {
    return `
        <div class="auth-page">
            <div class="auth-card">
                <h2>🔐 Acesse sua conta</h2>
                <p class="subtitle">Use <strong>adm</strong> / <strong>123456</strong> ou crie uma conta</p>
                <div id="authMsg" class="msg-error"></div>
                <form id="loginForm">
                    <label for="loginEmail">E-mail</label>
                    <input type="text" id="loginEmail" placeholder="adm" value="adm">
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

/**
 * Página de Cadastro
 */
function pageCadastro() {
    return `
        <div class="auth-page">
            <div class="auth-card">
                <h2>📝 Criar conta</h2>
                <p class="subtitle">Comece sua jornada no Jiu-Jitsu</p>
                <div id="authMsg" class="msg-error"></div>
                <form id="cadastroForm">
                    <label for="cadNome">Nome completo</label>
                    <input type="text" id="cadNome" placeholder="Seu nome" required>
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

/**
 * Página Home
 */
function pageHome() {
    return `
        <div class="hero-banner">
            <h1>Arte Suave, <span>Disciplina Forte</span></h1>
            <p>Bem-vindo, <strong>${currentUser?.nome || 'Campeão'}!</strong> 🥋</p>
        </div>
        <h2 class="page-title">📖 O que é Jiu-Jitsu?</h2>
        <p style="font-size:1.1rem; line-height:1.8; max-width:800px;">
            O <strong>Jiu-Jitsu Brasileiro</strong> é uma arte marcial que ensina que a técnica e a alavanca podem vencer a força bruta.
            Focado no combate no chão, utiliza estrangulamentos, imobilizações e torções para controlar o oponente.
        </p>
        <div style="background:var(--bg-header); color:#fff; padding:1.5rem; border-radius:var(--radius); margin-top:1.5rem; text-align:center; font-style:italic;">
            "A suavidade supera a dureza" – Princípio do Jiu-Jitsu
        </div>
        <div style="margin-top:2rem;">
            <img src="https://grapplinginsider.com/wp-content/uploads/2022/05/graciefamily.jpg" 
                 alt="Família Gracie" 
                 style="width:100%; max-width:600px; border-radius:var(--radius); box-shadow:var(--shadow); display:block; margin:0 auto;">
        </div>
    `;
}

/**
 * Página Faixas (com carrossel e vídeos)
 */
function pageFaixas() {
    // Carrossel: apenas 3 imagens (rolamento + 2 novas)
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

    // Gerar cards com vídeos
    let cardsHTML = faixasData.map(faixa => {
        let posicoesHTML = faixa.posicoes.map((p, idx) =>
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
                <p style="margin-bottom:1.5rem;">Clique no ícone ▶ ao lado de cada posição para assistir ao vídeo da técnica.</p>

                <div class="carousel-container" id="carousel">
                    <div class="carousel-slides" id="carouselSlides">${slidesHTML}</div>
                    <button class="carousel-btn prev" id="carouselPrev">‹</button>
                    <button class="carousel-btn next" id="carouselNext">›</button>
                    <div class="carousel-indicators" id="carouselIndicators">${dotsHTML}</div>
                </div>

                <div class="card-grid">${cardsHTML}</div>
            `;
}

/**
 * Página Promoção (Troca de Faixa)
 */
function pagePromocao() {
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
            `;
}

/**
 * Página Benefícios com evidências científicas
 */
function pageBeneficios() {
    return `
        <h2 class="page-title">✅ Benefícios do Jiu-Jitsu Baseados em Evidências Científicas</h2>

        <!-- Benefício 1 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">💪</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Condicionamento Físico</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        O Jiu-Jitsu Brasileiro desenvolve força muscular, resistência cardiorrespiratória e flexibilidade. 
                        Estudos com atletas de alto nível demonstraram excelentes índices de resistência muscular e condicionamento físico geral.
                    </p>
                    <div style="margin-top:0.8rem; display:flex; flex-wrap:wrap; gap:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/28194734/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 28194734</a>
                        <a href="https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-016-0069-5" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">Sports Medicine Open</a>
                        <a href="https://www.sciencedirect.com/science/article/pii/S0765159711000025" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">ScienceDirect</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefício 2 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">🧠</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Disciplina Mental</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        A prática regular do Jiu-Jitsu exige foco, autocontrole, paciência e capacidade de adaptação constante. 
                        O treinamento frequente fortalece habilidades cognitivas relacionadas à tomada de decisão sob pressão.
                    </p>
                    <div style="margin-top:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/41602804/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 41602804</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefício 3 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">🛡️</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Defesa Pessoal</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        O Jiu-Jitsu foi desenvolvido para permitir que uma pessoa controle e neutralize um agressor utilizando alavancas, 
                        posicionamento e técnica, reduzindo a dependência de força bruta. A literatura científica caracteriza o BJJ como 
                        uma modalidade de grappling focada em controle corporal e submissão do adversário.
                    </p>
                    <div style="margin-top:0.8rem; display:flex; flex-wrap:wrap; gap:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/28194734/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 28194734</a>
                        <a href="https://www.sciencedirect.com/science/article/pii/S0765159711000025" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">ScienceDirect</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefício 4 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">🤝</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Comunidade e Valores</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        O ambiente do Jiu-Jitsu promove respeito, hierarquia saudável, cooperação e desenvolvimento de vínculos sociais. 
                        A convivência diária nos treinos favorece o senso de pertencimento e a construção de amizades duradouras.
                    </p>
                    <div style="margin-top:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/28194734/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 28194734</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefício 5 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">😌</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Redução do Estresse</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        A combinação de exercício físico intenso, interação social e foco mental contribui para redução dos níveis 
                        de estresse e ansiedade, além de favorecer o bem-estar psicológico geral. Estudos em esportes de combate 
                        apontam benefícios importantes para a saúde mental dos praticantes.
                    </p>
                    <div style="margin-top:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/41602804/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 41602804</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefício 6 -->
        <div class="benefit-item" style="margin-bottom:2rem; padding:1.5rem; background:var(--bg-card); border-radius:var(--radius); border-left:6px solid var(--accent);">
            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                <div style="font-size:3rem;">🧩</div>
                <div style="flex:1;">
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Resolução de Problemas</h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        Cada treino funciona como um desafio estratégico. O praticante precisa analisar situações, antecipar movimentos 
                        e tomar decisões rápidas em tempo real. Pesquisas recentes encontraram associação entre nível técnico e funções 
                        cognitivas ligadas à tomada de decisão e adaptação sob pressão.
                    </p>
                    <div style="margin-top:0.8rem;">
                        <a href="https://pubmed.ncbi.nlm.nih.gov/41602804/" target="_blank" style="color:var(--accent); font-size:0.85rem; text-decoration:underline;">PubMed: 41602804</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Referências Científicas -->
        <div style="margin-top:3rem; padding:2rem; background:var(--bg-header); color:#fff; border-radius:var(--radius);">
            <h3 style="color:var(--accent); margin-bottom:1.5rem; font-size:1.3rem;">📚 Referências Científicas</h3>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.8rem;">
                <li>
                    <span style="opacity:0.8;">Andreato LV et al.</span>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/28194734/" target="_blank" style="color:var(--accent); text-decoration:underline; margin-left:0.5rem;">
                        Physical and Physiological Profiles of Brazilian Jiu-Jitsu Athletes: A Systematic Review
                    </a>
                </li>
                <li>
                    <span style="opacity:0.8;">Andreato LV et al.</span>
                    <a href="https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-016-0069-5" target="_blank" style="color:var(--accent); text-decoration:underline; margin-left:0.5rem;">
                        Physical and Physiological Profiles of Brazilian Jiu-Jitsu Athletes
                    </a>
                </li>
                <li>
                    <span style="opacity:0.8;">Silva BV et al.</span>
                    <a href="https://www.sciencedirect.com/science/article/pii/S0765159711000025" target="_blank" style="color:var(--accent); text-decoration:underline; margin-left:0.5rem;">
                        Estimated Aerobic Power, Muscular Strength and Flexibility in Elite Brazilian Jiu-Jitsu Athletes
                    </a>
                </li>
                <li>
                    <span style="opacity:0.8;">Peric T et al.</span>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/41602804/" target="_blank" style="color:var(--accent); text-decoration:underline; margin-left:0.5rem;">
                        Cognitive Functions and Skill Level in Brazilian Jiu-Jitsu: An Exploratory Study Using Virtual Reality
                    </a>
                </li>
            </ul>
            <div style="margin-top:1.2rem; padding:1rem; background:rgba(255,255,255,0.06); border-radius:8px; border-left:4px solid var(--accent);">
                <p style="font-size:0.9rem; opacity:0.9; font-style:italic;">
                    Esta landing page apresenta benefícios com respaldo científico verificável, 
                    proporcionando credibilidade e transparência para sua jornada no Jiu-Jitsu.
                </p>
            </div>
        </div>

        <!-- Botão (mantido inalterado) -->
        <div class="btn-center" style="margin-top:2rem;">
            <a href="https://www.atletis.com.br/jiu-jitsu" target="_blank" class="btn-link">
                Quero saber mais →
            </a>
        </div>
    `;
}
// ==================================================
// 6. ROTEADOR
// ==================================================

/**
 * Navega para a página especificada
 * Protege rotas que exigem autenticação
 */
function navigate(page) {
    currentPage = page;

    // Proteção de rotas: se não estiver logado, vai para login
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
    updateNav();
    attachEvents(page);

    // Inicializa componentes específicos da página
    if (page === 'faixas') {
        initCarousel();
        attachVideoEvents();
    }
}

// ==================================================
// 7. CARROSSEL
// ==================================================
let currentSlide = 0;
let totalSlides = 0;
let autoPlayInterval = null;

/**
 * Inicializa o carrossel com auto-play e navegação
 */
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!slides.length) return;

    totalSlides = slides.length;
    currentSlide = 0;

    function goTo(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        const container = document.getElementById('carouselSlides');
        if (container) {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        indicators.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    // Eventos dos botões
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goTo(currentSlide - 1);
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goTo(currentSlide + 1);
            resetAutoPlay();
        });
    }

    // Eventos dos indicadores
    indicators.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            resetAutoPlay();
        });
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (currentPage !== 'faixas') return;
        if (e.key === 'ArrowLeft') {
            goTo(currentSlide - 1);
            resetAutoPlay();
        }
        if (e.key === 'ArrowRight') {
            goTo(currentSlide + 1);
            resetAutoPlay();
        }
    });

    // Auto-play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goTo(currentSlide + 1);
        }, 4000);
    }

    function resetAutoPlay() {
        startAutoPlay();
    }

    // Pausa no hover
    const container = document.getElementById('carousel');
    if (container) {
        container.addEventListener('mouseenter', () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        });
        container.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
    goTo(0);
}

// ==================================================
// 8. EVENTOS DE VÍDEO (modal)
// ==================================================

/**
 * Adiciona eventos de clique nos itens de vídeo
 */
function attachVideoEvents() {
    document.querySelectorAll('.card-item ul li[data-video]').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.video;
            const title = item.dataset.title;
            openVideo(url, title);
        });
    });
}

// Fechar modal
closeModal.addEventListener('click', closeVideo);
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
});

// ==================================================
// 9. MENU DE NAVEGAÇÃO
// ==================================================

/**
 * Atualiza o menu com base no estado de autenticação
 */
function updateNav() {
    if (currentUser) {
        navLinks.innerHTML = `
                    <li><a href="#" data-page="home" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
                    <li><a href="#" data-page="faixas" class="${currentPage === 'faixas' ? 'active' : ''}">Faixas</a></li>
                    <li><a href="#" data-page="promocao" class="${currentPage === 'promocao' ? 'active' : ''}">Promoção</a></li>
                    <li><a href="#" data-page="beneficios" class="${currentPage === 'beneficios' ? 'active' : ''}">Benefícios</a></li>
                    <li><button class="btn-logout" id="logoutBtn">Sair</button></li>
                `;

        navLinks.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(link.dataset.page);
                document.getElementById('navLinks').classList.remove('open');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } else {
        navLinks.innerHTML = `
                    <li><a href="#" data-page="login" class="${currentPage === 'login' ? 'active' : ''}">Login</a></li>
                    <li><a href="#" data-page="cadastro" class="${currentPage === 'cadastro' ? 'active' : ''}">Cadastro</a></li>
                `;

        navLinks.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(link.dataset.page);
                document.getElementById('navLinks').classList.remove('open');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

// ==================================================
// 10. AUTENTICAÇÃO
// ==================================================

/**
 * Realiza login do usuário
 */
function login(email, senha) {
    const users = JSON.parse(localStorage.getItem('jj_users')) || [];
    const user = users.find(u => u.email === email && u.senha === senha);

    if (!user) {
        showMessage('error', 'E-mail ou senha inválidos.');
        return false;
    }

    currentUser = { nome: user.nome, email: user.email };
    localStorage.setItem('jj_user', JSON.stringify(currentUser));
    navigate('home');
    return true;
}

/**
 * Realiza cadastro de novo usuário
 */
function cadastro(nome, email, senha, confirma) {
    if (senha !== confirma) {
        showMessage('error', 'As senhas não coincidem.');
        return false;
    }

    if (senha.length < 6) {
        showMessage('error', 'A senha deve ter pelo menos 6 caracteres.');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('jj_users')) || [];

    if (users.find(u => u.email === email)) {
        showMessage('error', 'Este e-mail já está cadastrado.');
        return false;
    }

    users.push({ nome, email, senha });
    localStorage.setItem('jj_users', JSON.stringify(users));

    showMessage('success', 'Conta criada com sucesso! Faça login.');
    navigate('login');
    return true;
}

/**
 * Realiza logout do usuário
 */
function logout() {
    localStorage.removeItem('jj_user');
    currentUser = null;
    navigate('login');
}

// ==================================================
// 11. EVENTOS ESPECÍFICOS DAS PÁGINAS
// ==================================================

/**
 * Anexa eventos específicos de cada página
 */
function attachEvents(page) {
    // Login
    if (page === 'login') {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const senha = document.getElementById('loginSenha').value.trim();
                login(email, senha);
            });
        }

        const goCad = document.getElementById('goToCadastro');
        if (goCad) {
            goCad.addEventListener('click', () => navigate('cadastro'));
        }
    }

    // Cadastro
    if (page === 'cadastro') {
        const form = document.getElementById('cadastroForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nome = document.getElementById('cadNome').value.trim();
                const email = document.getElementById('cadEmail').value.trim();
                const senha = document.getElementById('cadSenha').value.trim();
                const confirma = document.getElementById('cadConfirma').value.trim();
                cadastro(nome, email, senha, confirma);
            });
        }

        const goLogin = document.getElementById('goToLogin');
        if (goLogin) {
            goLogin.addEventListener('click', () => navigate('login'));
        }
    }

    // Menu hamburger
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.getElementById('navLinks');
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    }
}

// ==================================================
// 12. TEMA ESCURO
// ==================================================

/**
 * Alterna entre tema claro e escuro
 */
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

// Carregar tema salvo
(function loadTheme() {
    const saved = localStorage.getItem('jj_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    if (themeToggle) {
        themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
    }
})();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ==================================================
// 13. INICIALIZAÇÃO
// ==================================================

/**
 * Inicializa a aplicação
 */
function init() {
    if (currentUser) {
        navigate('home');
    } else {
        navigate('login');
    }
}

// Inicia a aplicação
init();
