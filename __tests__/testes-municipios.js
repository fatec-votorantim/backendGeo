/**
 * Testes na API de Municipios
 * 
 */
const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config() //carrega os valores do .env

const baseURL = 'http://localhost:3000/api'

describe('API REST de Municipios sem o Token', () => {
    it('GET / Lista todos os municipios s/o token', async() => {
        const response = await request(baseURL)
        .get('/municipios')
        .set('Content-Type', 'application/json')
        .expect(401) // Unauthorized
    })

    it('GET - Listar o municipio pelo ID s/token', async() =>{
        const id = '67cf88503425da7e49dfcb21'
        const response = await request(baseURL)
        .get(`/municipios/${id}`)
        .set('Content-Type', 'application/json')
        .expect(401) // unauthorized
    })
})