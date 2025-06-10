import express from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import { connectToDatabase } from './config/db.js';
import municipiosRoutes from './routes/municipios.js';
import usuariosRoutes from './routes/usuarios.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', express.static('public'));

app.use('/api/municipios', municipiosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Rota dedicada para servir o arquivo swagger_output.json
app.get('/api/swagger-json', (req, res) => {
    const swaggerJsonPath = path.join(__dirname, 'swagger', 'swagger_output.json');
    try {
        const swaggerFileContent = fs.readFileSync(swaggerJsonPath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerFileContent);
    } catch (err) {
        console.error(`Erro ao servir swagger_output.json: ${err.message}`);
        res.status(500).json({ error: "Could not retrieve swagger.json", details: err.message });
    }
});

// Determina o caminho para swagger-ui-dist
let swaggerUiPath;
try {
    const swaggerUiBundleUrl = await import.meta.resolve('swagger-ui-dist/swagger-ui-bundle.js');
    swaggerUiPath = path.dirname(fileURLToPath(swaggerUiBundleUrl));
} catch (e) {
    console.warn("Falha ao resolver 'swagger-ui-dist'. Usando caminho de fallback.");
    swaggerUiPath = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist');
}

// Rota da documentação Swagger UI
app.use('/api/doc', express.static(swaggerUiPath), swaggerUI.serve, swaggerUI.setup({
    // A interface do Swagger UI buscará a especificação desta URL
    url: '/api/swagger-json' 
}, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
}));

app.use('/favicon.ico', express.static('public/images/logo.png'));

connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`);
    });
});