// Dica. Utilize o editor disponível em: https://editor.swagger.io/
import swaggerAutogen from 'swagger-autogen'

const doc = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "📊📈API Fatec Votorantim",
        description: "➡️Documentação gerada automaticamente pelo módulo <a href='https://github.com/davibaltar/swagger-autogen' target='_blank'>swagger-autogen</a>."
    },
    host: 'backend-rest-mongodb.vercel.app',
    basePath: "/api",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "header",      // can be "header", "query" or "cookie"
            name: "access-token",   // name of the header, query parameter or cookie
            description: "Token de Acesso gerado após o login"
        }
    },
    definitions: {
        Erro: {
            value: "Erro gerado pela aplicação",
            msg: "Mensagem detalhando o erro",
            param: "URL que gerou o erro"
        }
    }
}

const outputFile = './api/swagger/swagger_output.json'
const endpointsFiles = [
    './api/routes/municipios.js',
    './api/routes/usuarios.js'
    // Adicione outros arquivos de rota que você tenha, por exemplo:
    // './api/routes/produtos.js',
];
// =============================

const options = {
    swagger: '2.0',
    language: 'pt-BR',
    disableLogs: false,
    disableWarnings: false
}


swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentação Swagger gerada com sucesso em:', outputFile);
});