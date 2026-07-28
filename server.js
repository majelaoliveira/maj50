const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Serve todos os arquivos estáticos a partir da raiz do projeto
// (index.html, assets/, etc.)
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`MajFifty Robot rodando em http://localhost:${PORT}`);
});
