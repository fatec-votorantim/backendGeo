import express from 'express'
import { config } from 'dotenv'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'
import usuariosRoutes from './routes/usuarios.js'
import swaggerDocument from './swagger/swagger_output.json' assert { type: "json" }

config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rota pública para arquivos estáticos
app.use('/', express.static('public'))

// Rotas principais da API
app.use('/api/municipios', municipiosRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Rota de documentação do Swagger (sem custom CSS)
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// Favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))

// Inicialização com conexão ao banco
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
    })
})
