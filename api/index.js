import express from 'express'
import {config} from 'dotenv'
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors' // Importa o módulo cors
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'
import usuariosRoutes from './routes/usuarios.js'

config() //carrega o conteúdo do .env
const app = express()
const PORT = process.env.PORT || 3000


app.use(cors()) //Habilita o CORS Cross-Origin resource sharing
app.use(express.json())//parse do JSON
//rota pública
app.use('/', express.static('public'))
//Rotas do app
app.use('/api/municipios', municipiosRoutes)
app.use('/api/usuarios', usuariosRoutes)
// Rota da documentação Swagger 
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./api/swagger/swagger_output.json')), {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }'
}))
//define o favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))
//start the server
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})