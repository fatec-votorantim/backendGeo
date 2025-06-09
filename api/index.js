import express from 'express'
import { config } from 'dotenv'
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import { connectToDatabase } from './config/db.js'
import municipiosRoutes from './routes/municipios.js'
import usuariosRoutes from './routes/usuarios.js'
import path from 'path' // Importa o módulo path
import { fileURLToPath } from 'url' // Importa fileURLToPath para módulos ES

// Obter equivalente a __dirname e __filename em módulos ES
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

// Determine o caminho para swagger-ui-dist usando uma abordagem compatível com módulos ES
let swaggerUiPath;
try {
    // Tenta resolver o caminho de um arquivo conhecido dentro de 'swagger-ui-dist'
    // 'import.meta.resolve' é uma função assíncrona e precisa ser 'await'
    // Como estamos no top-level de um módulo ES, 'await' pode ser usado diretamente.
    const swaggerUiBundleUrl = await import.meta.resolve('swagger-ui-dist/swagger-ui-bundle.js');
    // Converte a URL do arquivo para um caminho de sistema de arquivos e obtém o diretório pai
    swaggerUiPath = path.dirname(fileURLToPath(swaggerUiBundleUrl));
} catch (e) {
    console.warn("Falha ao resolver 'swagger-ui-dist/swagger-ui-bundle.js' usando import.meta.resolve. Tentando caminho de fallback.");
    // Fallback: Isso assume que 'swagger-ui-dist' está em 'node_modules' na raiz do seu projeto.
    // 'process.cwd()' retorna o diretório de trabalho atual do processo Node.js,
    // que geralmente é a raiz do projeto no Vercel.
    swaggerUiPath = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist');
}

// Rota da documentação Swagger
// Serve os arquivos estáticos do Swagger UI diretamente de swagger-ui-dist antes do swaggerUI.setup
app.use('/api/doc', express.static(swaggerUiPath), swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./api/swagger/swagger_output.json')), {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    // customCssUrl: CSS_URL // Certifique-se de que esta linha esteja comentada ou removida
}));

// define o favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))

// start the server
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})