document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // ESTADO
    // =========================
    let usuariosCadastrados = [
        { nomeUsuario: 'teste', senha: '123', email: 'teste@email.com' }
    ];

    const body = document.body;
    const navPrincipal = document.querySelector('nav');
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const btnLoginDesktop = document.getElementById('btnCabecalhoLoginDesktop');
    const btnLoginMobile = document.getElementById('btnCabecalhoLoginMobile');

    // =========================
    // HELPERS MODAL
    // =========================
    function abrirModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('aberto'), 10);
    }

    function fecharModal(modal) {
        modal.classList.remove('aberto');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // =========================
    // MODAL LOGIN
    // =========================
    const modalLogin = document.createElement('div');
    modalLogin.className = 'modal modal-login';
    modalLogin.innerHTML = `
        <div class="conteudo-modal">
            <span class="btn-fechar">&times;</span>
            <h2>Entrar</h2>
            <form id="formLogin">
                <div class="grupo-input">
                    <label>E-mail</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="grupo-input">
                    <label>Senha</label>
                    <input type="password" id="loginSenha" required>
                </div>
                <button type="submit" class="btn">Entrar</button>
                <p class="link-cadastro">Não tem conta? <a href="#" id="abrirCadastro">Cadastre-se</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modalLogin);

    // =========================
    // MODAL CADASTRO
    // =========================
    const modalCadastro = document.createElement('div');
    modalCadastro.className = 'modal modal-cadastro';
    modalCadastro.innerHTML = `
        <div class="conteudo-modal">
            <span class="btn-fechar">&times;</span>
            <h2>Criar Conta</h2>
            <form id="formCadastro">
                <div class="grupo-input">
                    <label>Nome</label>
                    <input type="text" id="cadNome" required>
                </div>
                <div class="grupo-input">
                    <label>E-mail</label>
                    <input type="email" id="cadEmail" required>
                </div>
                <div class="grupo-input">
                    <label>Telefone</label>
                    <input type="tel" id="cadTelefone" required>
                </div>
                <div class="grupo-input">
                    <label>Senha</label>
                    <input type="password" id="cadSenha" required>
                </div>
                <div class="grupo-input">
                    <label>Confirmar Senha</label>
                    <input type="password" id="cadConfirmarSenha" required>
                </div>
                <button type="submit" class="btn">Cadastrar</button>
                <p class="link-voltar">Já tem conta? <a href="#" id="voltarLogin">Entrar</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modalCadastro);

    // =========================
    // AUTH
    // =========================
    function initAuth() {
        const btnFecharLogin = modalLogin.querySelector('.btn-fechar');
        const btnFecharCadastro = modalCadastro.querySelector('.btn-fechar');

        btnLoginDesktop?.addEventListener('click', e => {
            e.preventDefault();
            abrirModal(modalLogin);
        });

        btnLoginMobile?.addEventListener('click', e => {
            e.preventDefault();
            abrirModal(modalLogin);
        });

        btnFecharLogin.addEventListener('click', () => fecharModal(modalLogin));
        btnFecharCadastro.addEventListener('click', () => fecharModal(modalCadastro));

        modalLogin.querySelector('#abrirCadastro').addEventListener('click', e => {
            e.preventDefault();
            fecharModal(modalLogin);
            abrirModal(modalCadastro);
        });

        modalCadastro.querySelector('#voltarLogin').addEventListener('click', e => {
            e.preventDefault();
            fecharModal(modalCadastro);
            abrirModal(modalLogin);
        });

        // LOGIN
        modalLogin.querySelector('#formLogin').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            const usuario = usuariosCadastrados.find(u => u.email === email && u.senha === senha);

            if (usuario) {
                alert(`Bem-vindo, ${usuario.nomeUsuario || usuario.email}`);
                fecharModal(modalLogin);
            } else {
                alert('E-mail ou senha inválidos');
            }
        });

        // CADASTRO
        modalCadastro.querySelector('#formCadastro').addEventListener('submit', e => {
            e.preventDefault();

            const nome = document.getElementById('cadNome').value;
            const email = document.getElementById('cadEmail').value;
            const telefone = document.getElementById('cadTelefone').value;
            const senha = document.getElementById('cadSenha').value;
            const confirmar = document.getElementById('cadConfirmarSenha').value;

            if (senha !== confirmar) {
                alert('As senhas não coincidem');
                return;
            }

            const existe = usuariosCadastrados.some(u => u.email === email);
            if (existe) {
                alert('Este e-mail já está cadastrado');
                return;
            }

            usuariosCadastrados.push({ nomeUsuario: nome, email, telefone, senha });
            alert('Cadastro realizado com sucesso!');
            fecharModal(modalCadastro);
            abrirModal(modalLogin);
        });

        window.addEventListener('click', e => {
            if (e.target === modalLogin) fecharModal(modalLogin);
            if (e.target === modalCadastro) fecharModal(modalCadastro);
        });
    }

    // =========================
    // MENU MOBILE
    // =========================
    function initMenuMobile() {
        if (!menuHamburguer || !navPrincipal) return;

        function fecharMenu() {
            navPrincipal.classList.remove('aberto');
            menuHamburguer.classList.remove('ativo');
            body.classList.remove('no-scroll');
        }

        menuHamburguer.addEventListener('click', () => {
            menuHamburguer.classList.toggle('ativo');
            navPrincipal.classList.toggle('aberto');
            body.classList.toggle('no-scroll');
        });

        navPrincipal.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', fecharMenu);
        });

        window.addEventListener('scroll', fecharMenu);
    }

    // =========================
    // SCROLL ANIMATIONS
    // =========================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.js-scroll');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    }

    // =========================
    // INIT
    // =========================
    initAuth();
    initMenuMobile();
    initScrollAnimations();

    body.classList.add('loaded');

});

// === ADD TO CART FROM DESTAQUES ===
document.addEventListener('DOMContentLoaded', () => {
    const botoesDestaque = document.querySelectorAll('.btn-adicionar-carrinho');

    botoesDestaque.forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;
            const nome = botao.dataset.nome;
            const preco = parseFloat(botao.dataset.preco);

            // Se existir função global de carrinho, usa ela
            if (typeof adicionarAoCarrinho === 'function') {
                adicionarAoCarrinho({ id, nome, preco, quantidade: 1 });
                mostrarToast(`${nome} adicionado ao carrinho 🛒`);
            } else {
                // Fallback: manda para o cardápio
                window.location.href = 'cardapio.html';
            }
        });
    });

    function mostrarToast(mensagem) {
    let toast = document.createElement('div');
    toast.className = 'toast-carrinho';
    toast.innerText = mensagem;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

});
