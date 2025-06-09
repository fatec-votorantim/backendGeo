import express from 'express'
import {config} from 'dotenv'
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'
import usuariosRoutes from './routes/usuarios.js'
import path from 'path' // Importa o módulo path
import { fileURLToPath } from 'url' // Importa fileURLToPath para módulos ES

// Obter equivalente a __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config() // carrega o conteúdo do .env
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors()) // Habilita o CORS Cross-Origin resource sharing
app.use(express.json()) // parse do JSON

// rota pública
app.use('/', express.static('public'))

// Rotas do app
app.use('/api/municipios', municipiosRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Determine o caminho para swagger-ui-dist
// Solução para funcionar no Vercel, garantindo que utilize o caminho especificado
const swaggerUiPath = path.dirname(require.resolve('swagger-ui-dist'));

// Serve os arquivos estáticos do Swagger UI diretamente de swagger-ui-dist
app.use('/api/doc', express.static(swaggerUiPath), swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./api/swagger/swagger_output.json')), {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }'
}));

// define o favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))

// start the server
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})