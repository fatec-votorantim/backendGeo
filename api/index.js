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

// --- ADICIONE ESTE LOG PARA DEPURAR ---
console.log(`__dirname (diretório da função): ${__dirname}`);

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

// --- CÓDIGO DE DEBUG TEMPORÁRIO: REMOVA DEPOIS DE CONCLUIR O DIAGNÓSTICO ---
// Esta rota permitirá que você veja o conteúdo EXATO do swagger_output.json
// que está sendo lido pelo seu backend no Vercel.
app.get('/api/debug-swagger-json', (req, res) => {
    const debugSwaggerFilePath = path.join(__dirname, 'swagger', 'swagger_output.json');
    try {
        const debugFileContent = fs.readFileSync(debugSwaggerFilePath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.send(debugFileContent);
        console.log("DEBUG: Arquivo swagger_output.json servido via /api/debug-swagger-json");
    } catch (err) {
        console.error(`DEBUG ERRO: Falha ao servir swagger_output.json via /api/debug-swagger-json: ${err.message}`);
        res.status(500).json({ 
            error: "Não foi possível servir o swagger_output.json para debug", 
            details: err.message,
            pathAttempted: debugSwaggerFilePath 
        });
    }
});
// --- FIM DO CÓDIGO DE DEBUG TEMPORÁRIO ---

// Determine o caminho para swagger-ui-dist usando uma abordagem compatível com módulos ES
let swaggerUiPath;
try {
    const swaggerUiBundleUrl = await import.meta.resolve('swagger-ui-dist/swagger-ui-bundle.js');
    swaggerUiPath = path.dirname(fileURLToPath(swaggerUiBundleUrl));
} catch (e) {
    console.warn("Falha ao resolver 'swagger-ui-dist/swagger-ui-bundle.js' usando import.meta.resolve. Tentando caminho de fallback.");
    swaggerUiPath = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist');
}
// --- ADICIONE ESTE LOG PARA DEPURAR ---
console.log(`swaggerUiPath (para arquivos estáticos do Swagger UI): ${swaggerUiPath}`);


// Rota da documentação Swagger
let swaggerDocument;
const swaggerFilePath = path.join(__dirname, 'swagger', 'swagger_output.json');

console.log(`Tentando ler o arquivo swagger_output.json em: ${swaggerFilePath}`);

try {
    const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf8');
    swaggerDocument = JSON.parse(swaggerFileContent);
    console.log("swagger_output.json lido e parseado com sucesso!");
} catch (err) {
    console.error(`ERRO CRÍTICO: Falha ao ler ou parsear swagger_output.json em ${swaggerFilePath}: ${err.message}`);
    swaggerDocument = {};
}

app.use('/api/doc', express.static(swaggerUiPath), swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
}));

// define o favicon
app.use('/favicon.ico', express.static('public/images/logo.png'))

// start the server
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})