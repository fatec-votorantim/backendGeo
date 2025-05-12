use('test')
db.usuarios.insertOne({
    'nome': 'Maria José',
    'email': 'mariajose@uol.com.br',
    'senha': '123Mudar',
    'ativo': true,
    'tipo': 'Cliente', //ou Admin
    'avatar': 'https://ui-avatars.com/api?name=Maria+José&background=F00&color=FFF'
})
//Criando um índice único para o email
db.usuarios.createIndex({'email':1},{unique:true})
//Listando os usuários
db.usuarios.find({},{senha:0})