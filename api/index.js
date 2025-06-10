import express from 'express'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'
import usuariosRoutes from './routes/usuarios.js'

config()
const app = express()
const PORT = process.env.PORT || 3000
const CSS_URL = "/swagger-ui.css" // Caminho relativo à pasta 'public'

app.use(cors())
app.use(express.json())

// Rotas do sistema
app.use('/', express.static('public'))
app.use('/api/municipios', municipiosRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Carregamento do Swagger JSON de forma síncrona
const swaggerFilePath = path.resolve('api/swagger/swagger_output.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'))

// Rota da documentação 
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL
}))

// Favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))

// Início do servidor
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀Servidor rodando na porta ${PORT}`)
    })
})
