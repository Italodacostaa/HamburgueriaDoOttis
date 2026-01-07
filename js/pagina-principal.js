document.addEventListener('DOMContentLoaded', () => {
    // --- Dados de Usuários (Simulação de um "Banco de Dados") ---
    // Este array armazenará os usuários cadastrados.
    // Os dados serão perdidos ao fechar a página, mas servirão para testar o fluxo.
    let usuariosCadastrados = [
        { nomeUsuario: 'teste', senha: '123' } // Usuário inicial para testar
    ];

    const btnCabecalhoLoginDesktop = document.getElementById('btnCabecalhoLoginDesktop'); // Botão de login para desktop
    const btnCabecalhoLoginMobile = document.getElementById('btnCabecalhoLoginMobile'); // Botão de login para mobile (dentro da nav)
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const navPrincipal = document.querySelector('nav'); // Esta é a referência que você já tem
    const body = document.body; // Referência ao body para controlar o scroll


        // --- Funcionalidade de Abertura/Fechamento de Modais (Genérica) ---
    function abrirModal(modalElement) {
        modalElement.style.display = 'flex';
        setTimeout(() => modalElement.classList.add('aberto'), 10);
    }

    function fecharModal(modalElement) {
        modalElement.classList.remove('aberto');
        setTimeout(() => modalElement.style.display = 'none', 300);
    }

    // --- Funcionalidade do Login ---
    if (btnCabecalhoLoginDesktop) {
    // Você pode querer exibir um ícone aqui se não estiver no HTML
    btnCabecalhoLoginDesktop.innerHTML = '<i class="fas fa-user"></i>'; 
    btnCabecalhoLoginDesktop.setAttribute('aria-label', 'Login');

    btnCabecalhoLoginDesktop.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal(modalLogin);
    });
}

    // Cria os elementos do modal de login DINAMICAMENTE
    const modalLogin = document.createElement('div');
    modalLogin.classList.add('modal', 'modal-login');
    modalLogin.id = 'modalLogin';
    modalLogin.innerHTML = `
        <div class="conteudo-modal">
            <span class="btn-fechar">&times;</span>
            <h2>Entrar</h2>
            <form id="formLogin">
                 <div class="grupo-input">
                    <label for="nomeUsuario">E-mail:</label> 
                    <input type="email" id="nomeUsuario" name="nomeUsuario" required placeholder="Digite seu e-mail"> 
                </div>
                <div class="grupo-input">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" required placeholder="Digite sua senha">
                </div>
                <button type="submit" class="btn">Entrar</button>
                <p class="link-cadastro">Não tem uma conta? <a href="#" id="linkAbrirCadastro">Cadastre-se</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modalLogin);

    const btnFecharModalLogin = modalLogin.querySelector('.btn-fechar');
    const formLogin = modalLogin.querySelector('#formLogin');
    const linkAbrirCadastro = modalLogin.querySelector('#linkAbrirCadastro');

    if (btnCabecalhoLoginMobile) {
    // Para o botão mobile, o texto "Login" já está no HTML, então não precisa de innerHTML
    // mas se quiser adicionar um ícone ao lado do texto, pode usar:
    // btnCabecalhoLoginMobile.innerHTML = '<i class="fas fa-user"></i> Login';
    btnCabecalhoLoginMobile.setAttribute('aria-label', 'Login'); // Acessibilidade

    btnCabecalhoLoginMobile.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal(modalLogin);
        // Opcional: Fechar o menu hambúrguer ao clicar no login
        // fecharMenuMobile(); // Certifique-se que fecharMenuMobile esteja acessível neste escopo
    });
}

    if (btnFecharModalLogin) {
        btnFecharModalLogin.addEventListener('click', () => {
            fecharModal(modalLogin);
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeUsuarioInput = document.getElementById('nomeUsuario').value;
            const senhaInput = document.getElementById('senha').value;

            // *** MUDANÇA AQUI: Verifica se o usuário existe no array usuariosCadastrados ***
            const usuarioEncontrado = usuariosCadastrados.find(
                user => user.nomeUsuario === nomeUsuarioInput && user.senha === senhaInput
            );

            if (usuarioEncontrado) {
                alert(`Login bem-sucedido! Bem-vindo, ${usuarioEncontrado.nomeUsuario}!`);
                fecharModal(modalLogin);
                formLogin.reset();
                // Aqui você pode armazenar o status de login (ex: em localStorage)
                // para manter o usuário logado em outras páginas ou após recarregar.
                // Ex: localStorage.setItem('usuarioLogado', usuarioEncontrado.nomeUsuario);
            } else {
                alert('Usuário ou senha incorretos.');
            }
        });
    }

    // --- Funcionalidade de Cadastro ---
    const modalCadastro = document.createElement('div');
    modalCadastro.classList.add('modal', 'modal-cadastro');
    modalCadastro.id = 'modalCadastro';
    modalCadastro.innerHTML = `
        <div class="conteudo-modal">
            <span class="btn-fechar" id="btnFecharModalCadastro">&times;</span>
            <h2>Criar Nova Conta</h2>
            <form id="formCadastro">
                <div class="grupo-input">
                    <label for="nomeCompleto">Nome Completo:</label>
                    <input type="text" id="nomeCompleto" name="nomeCompleto" required>
                </div>
                <div class="grupo-input">
                    <label for="emailCadastro">E-mail:</label>
                    <input type="email" id="emailCadastro" name="emailCadastro" required>
                </div>
                <div class="grupo-input">
                    <label for="telefoneCadastro">Telefone:</label>
                    <input type="tel" id="telefoneCadastro" name="telefoneCadastro" placeholder="(XX) XXXXX-XXXX" required>
                </div>
                <div class="grupo-input">
                    <label for="senhaCadastro">Senha:</label>
                    <input type="password" id="senhaCadastro" name="senhaCadastro" required>
                </div>
                <div class="grupo-input">
                    <label for="confirmarSenhaCadastro">Confirmar Senha:</label>
                    <input type="password" id="confirmarSenhaCadastro" name="confirmarSenhaCadastro" required>
                </div>
                <button type="submit" class="btn">Cadastrar</button>
                <p class="link-voltar-login">Já tem uma conta? <a href="#" id="linkVoltarLogin">Faça Login</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modalCadastro);

    const btnFecharModalCadastro = document.getElementById('btnFecharModalCadastro');
    const formCadastro = document.getElementById('formCadastro');
    const linkVoltarLogin = document.getElementById('linkVoltarLogin');

    if (linkAbrirCadastro) {
        linkAbrirCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            fecharModal(modalLogin);
            abrirModal(modalCadastro);
        });
    }

    if (linkVoltarLogin) {
        linkVoltarLogin.addEventListener('click', (e) => {
            e.preventDefault();
            fecharModal(modalCadastro);
            abrirModal(modalLogin);
        });
    }

    if (btnFecharModalCadastro) {
        btnFecharModalCadastro.addEventListener('click', () => {
            fecharModal(modalCadastro);
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();

            const nomeCompleto = document.getElementById('nomeCompleto').value;
            const emailCadastro = document.getElementById('emailCadastro').value;
            // Para o login, precisamos de um nome de usuário. Vamos usar o e-mail como nome de usuário.
            const nomeUsuarioCadastro = emailCadastro; 
            const telefoneCadastro = document.getElementById('telefoneCadastro').value;
            const senhaCadastro = document.getElementById('senhaCadastro').value;
            const confirmarSenhaCadastro = document.getElementById('confirmarSenhaCadastro').value;

            if (senhaCadastro !== confirmarSenhaCadastro) {
                alert('As senhas não coincidem. Por favor, verifique.');
                return;
            }

            // *** MUDANÇA AQUI: Adiciona o novo usuário ao array usuariosCadastrados ***
            const novoUsuario = {
                nomeCompleto: nomeCompleto,
                email: emailCadastro,
                telefone: telefoneCadastro,
                nomeUsuario: nomeUsuarioCadastro, // Usamos o email como nome de usuário para login
                senha: senhaCadastro
            };

            // Verifica se o usuário já existe (usando o email como critério único)
            const usuarioExistente = usuariosCadastrados.find(user => user.email === emailCadastro);
            if (usuarioExistente) {
                alert('Este e-mail já está cadastrado. Por favor, use outro ou faça login.');
                return;
            }

            usuariosCadastrados.push(novoUsuario);
            console.log('Novo usuário cadastrado:', novoUsuario);
            console.log('Todos os usuários cadastrados:', usuariosCadastrados); // Para depuração

            alert('Cadastro realizado com sucesso! Agora você pode fazer login.');

            formCadastro.reset();
            fecharModal(modalCadastro);
            abrirModal(modalLogin);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalLogin) {
            fecharModal(modalLogin);
        } else if (e.target === modalCadastro) {
            fecharModal(modalCadastro);
        }
    });

    // --- Funcionalidade do Menu Hambúrguer (para mobile) ---
// Verifica se os elementos do menu existem antes de adicionar event listeners
if (menuHamburguer && navPrincipal && body) {
    // Função para fechar o menu
    function fecharMenuMobile() {
        if (navPrincipal.classList.contains('aberto')) {
            navPrincipal.classList.remove('aberto');
            menuHamburguer.classList.remove('ativo');
            body.classList.remove('no-scroll'); // Remove a classe que impede o scroll
        }
    }

    // Evento de clique no ícone do hambúrguer
    menuHamburguer.addEventListener('click', () => {
        menuHamburguer.classList.toggle('ativo'); // Alterna a classe 'ativo' no ícone
        navPrincipal.classList.toggle('aberto');  // Alterna a classe 'aberto' no menu de navegação
        body.classList.toggle('no-scroll');     // Alterna a classe para impedir/permitir o scroll do body
    });

    // Evento de clique em um link dentro do menu (para fechar o menu ao navegar)
    // Garante que o menu feche se o usuário clicar em um link para uma seção da mesma página
    navPrincipal.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', fecharMenuMobile);
    });

    // NOVO: Fechar o menu ao rolar a página
    window.addEventListener('scroll', fecharMenuMobile);
}

});

// --- Animações ao Rolar (Scroll Reveal) com Intersection Observer ---

const scrollElements = document.querySelectorAll('.js-scroll');

// Opções para o Intersection Observer
const observerOptions = {
    root: null, // Observa em relação à viewport
    rootMargin: '0px', // Margem em torno do root (viewport)
    threshold: 0.2 // Porcentagem do elemento que deve estar visível para disparar o callback (20% visível)
};

// Callback que será executado quando um elemento intersecta (ou desintersecta) a viewport
const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Se o elemento está entrando na viewport
            entry.target.classList.add('animated');
            // Opcional: Se você quiser que a animação aconteça apenas uma vez (ao entrar pela primeira vez),
            // você pode descomentar a linha abaixo. Caso contrário, ele animará novamente
            // sempre que o elemento entrar na tela.
            // observer.unobserve(entry.target);
        } else {
            // Se o elemento está saindo da viewport
            // Isso permite que a animação seja reproduzida novamente ao rolar de volta
            entry.target.classList.remove('animated'); 
        }
    });
}, observerOptions);

// Atribuir o observer a cada elemento com a classe 'js-scroll'
scrollElements.forEach(el => {
    scrollObserver.observe(el);
});



// --- Inicialização de outras funcionalidades ao carregar o DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (o restante do seu código DOMContentLoaded existente, como o do login) ...

    // Adiciona a classe 'loaded' ao body para iniciar a animação de fade-in
    // (Se você estiver usando esta funcionalidade)
    if (document.body) {
        document.body.classList.add('loaded');
    }
});