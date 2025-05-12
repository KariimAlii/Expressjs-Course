// generate-swagger.js
const fs = require('fs');
const path = require('path');

// Import your manually defined OpenAPI document from joi-to-swagger
const openApiDocument = require('./swagger/openapi');

const outputPath = path.join(__dirname, 'swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));

console.log('✅ Swagger JSON generated at ./swagger.json');
