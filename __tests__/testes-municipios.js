/**
 * Testes na API de Municipios
 * 
 */
const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config() //carrega os valores do .env

const baseURL = 'http://localhost:3000/api'

describe('👉API REST de Municipios sem o Token', () => {
    it('GET - Lista todos os municipios semo token', async () => {
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

describe('👉API REST de Municipios com o Token', () => {
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

    it('GET - Obter os municipios com o token', async () => {
        const response = await request(baseURL)
            .get('/municipios')
            .set('Content-Type', 'application/json')
            .set('access-token', token) //inclui o token
            .expect(200) //Ok

        const municipios = response.body
        expect(municipios).toBeInstanceOf(Object)
    })

    let dadosMunicipio = {
        "codigo_ibge": 8400099,
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

        expect(response.body).toHaveProperty('_id')
        expect(typeof response.body._id).toBe('string')
        expect(response.body._id.length).toBeGreaterThan(0)

        idMunicipioInserido = response.body._id
    })

    it('GET /:id - Lista o municipio pelo id com token', async () => {
        const response = await request(baseURL)
            .get(`/municipios/${idMunicipioInserido}`)
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .expect(200)
    })

    it('PUT - Altera os dados do municipio', async () => {
        //alterando alguns dados 
        dadosMunicipio.nome += ' alterado'
        dadosMunicipio.codigo_ibge = '9999999'        
        const response = await request(baseURL)
            .put(`/municipios/${idMunicipioInserido}`)
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .send(dadosMunicipio)
            .expect(200)

        expect(response.body).toHaveProperty('_id')
        expect(typeof response.body._id).toBe('string')
        expect(response.body._id.length).toBeGreaterThan(0)
    })

    it('DELETE - Remove o municipio', async () => {
        const response = await request(baseURL)
            .delete(`/municipios/${idMunicipioInserido}`)
            .set('Content-Type', 'application/json')
            .set('access-token', token)
            .expect(200)

        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Município deleted successfully')
    })

})