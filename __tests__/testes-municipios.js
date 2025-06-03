/**
 * Testes na API de Municipios
 * 
 */
const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config() //carrega os valores do .env

const baseURL = 'http://localhost:3000/api'

describe('API REST de Municipios sem o Token', () => {
    it('GET / Lista todos os municipios s/o token', async () => {
        const response = await request(baseURL)
            .get('/municipios')
            .set('Content-Type', 'application/json')
            .expect(401) // Unauthorized
    })

    it('GET - Listar o municipio pelo ID s/token', async () => {
        const id = '67cf88503425da7e49dfcb21'
        const response = await request(baseURL)
            .get(`/municipios/${id}`)
            .set('Content-Type', 'application/json')
            .expect(401) // unauthorized
    })
})

describe('API REST de Municipios com o Token', () => {
    let token //armazenaremos o token JWT
    let idMunicipioInserido //Utilizaremos para editar e excluir
    it('POST - Autentica usuário', async () => {
        const senha = process.env.SENHA_USUARIO
        const response = await request(baseURL)
            .post('/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({ "email": "leme@fatec.gov.br", "senha": senha })
            .expect(200) //OK

        token = response.body.access_token
        expect(token).toBeDefined() //recebemos o token?
    })

    it('Obter os municipios com o token', async () => {
        const response = await request(baseURL)
            .get('/municipios')
            .set('Content-Type', 'application/json')
            .set('access-token', token) //inclui o token
            .expect(200) //Ok

        const municipios = response.body
        expect(municipios).toBeInstanceOf(Object)
    })

    const dadosMunicipio = {
        "codigo_ibge": 8200099,
        "nome": "Novo Municipio",
        "capital": false,
        "codigo_uf": 52,
        "local": {
            "type": "Point",
            "coordinates": [
                -45.4412,
                -16.7573
            ]
        }
    }

    it('POST - Inclui um novo municipio com autenticação', async () => {
        const response = await request(baseURL)
            .post('/municipios')
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .send(dadosMunicipio)
            .expect(201) //Created

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('insertedId')
        expect(typeof response.body.insertedId).toBe('string')
        idMunicipioInserido = response.body.insertedId
        expect(response.body.insertedId.length).toBeGreaterThan(0)
    })

    it('GET /:id - Lista o municipio pelo id com token', async () => {
        const response = await request(baseURL)
            .get(`/municipios/${idMunicipioInserido}`)
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .expect(200)
    })

    it('PUT - Altera os dados do municipio', async () => {
        novoDadosMunicipio = {
            ...dadosMunicipio, //spread operator
            '_id': idMunicipioInserido
        }
        novoDadosMunicipio.nome += ' alterado'
        const response = await request(baseURL)
            .put('/municipios')
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .send(novoDadosMunicipio)
            .expect(202) //Accepted

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('modifiedCount')
        expect(typeof response.body.modifiedCount).toBe('number')
        expect(response.body.modifiedCount).toBeGreaterThan(0)
    })

    it('DELETE - Remove o municipio', async () => {
        const response = await request(baseURL)
            .delete(`/municipios/${idMunicipioInserido}`)
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .expect(200)

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('deletedCount')
        expect(typeof response.body.deletedCount).toBe('number')
        expect(response.body.deletedCount).toBeGreaterThan(0)
    })

})