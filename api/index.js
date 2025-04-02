import express from 'express'
import cors from 'cors' // Importa o módulo cors
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'

const app = express()
const PORT = process.env.PORT || 3000


app.use(cors()) //Habilita o CORS Cross-Origin resource sharing
app.use(express.json())//parse do JSON
//rota pública
app.use('/', express.static('public'))
//Rotas do app
app.use('/api/municipios', municipiosRoutes)
//define o favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))
//start the server
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})