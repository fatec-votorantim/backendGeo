const urlBase = window.location.href.replace(/\/[^\/]*$/, '') + '/api'

document.getElementById('formUsuario').addEventListener('submit', function (event) {
    event.preventDefault() //evita o recarregamento
    const msgModal = new bootstrap.Modal(document.getElementById('modalMensagem'))
    //Limpa a mensagem de erro
    document.getElementById('mensagem').innerHTML = ''
    //obtendo os dados do formulário
    const nome = document.getElementById('nome').value
    const email = document.getElementById('login').value
    const senha = document.getElementById('senha').value
    //criando o objeto de inclusão
    const dadosUsuario = { nome: nome, email: email, senha: senha }    
    //Efetuar o POST para o endpoint
    fetch(`${urlBase}/usuarios`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosUsuario)
    })
        .then(response => response.json())
        .then(data => {
            //Verifica se o usuário foi cadastrado
            if (data.acknowledged) { //se true, inseriu!
                document.getElementById('mensagem').innerHTML = `<span class='text-success'>Usuário criado com sucesso! <br> Por favor, efetue o login. </span>`
                msgModal.show()
                setTimeout(() => {
                    window.location.href = 'index.html'
                }, 5000)
            } else if (data.errors) {
                //vamos pegar os erros da API
                const errorMessages = data.errors.map(error => error.msg).join('<br>')
                //Alteramos a mensagem no modal
                document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
                msgModal.show()
            }
        })
})