const express = require("express")
const fs = require("fs")

const app = express()
const PORTA = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let usosIA = require("./dados.json")

// GET - Consultar todos os usos
app.get("/", (req, res) => {
    res.json(usosIA)
})

// GET - Consultar por ID
app.get("/usos/:id", (req, res) => {
    const id = Number(req.params.id)

    const uso = usosIA.find(item => item.id === id)

    if (!uso) {
        return res.status(404).json({
            mensagem: "Uso de IA não encontrado"
        })
    }

    res.json(uso)
})

// GET - Consultar por tipo
app.get("/usos/tipo/:tipo", (req, res) => {
    const tipo = req.params.tipo.toLowerCase()

    const resultado = usosIA.filter(item =>
        item.tipo.toLowerCase() === tipo
    )

    res.json(resultado)
})

// GET - Consultar por nível de risco
app.get("/usos/risco/:nivel", (req, res) => {
    const nivel = req.params.nivel.toLowerCase()

    const resultado = usosIA.filter(item =>
        item.nivel_risco.toLowerCase() === nivel
    )

    res.json(resultado)
})

// POST - Cadastrar novo uso
app.post("/usos", (req, res) => {
    const novoUso = {
        id: usosIA.length > 0 ? Math.max(...usosIA.map(item => item.id)) + 1 : 1,
        sistema: req.body.sistema,
        tipo: req.body.tipo,
        finalidade: req.body.finalidade,
        tecnologia: req.body.tecnologia,
        nivel_risco: req.body.nivel_risco,
        possui_revisao_humana: req.body.possui_revisao_humana === "true"
    }

    usosIA.push(novoUso)

    salvarDados()

    res.status(201).json(novoUso)
})

// PUT - Atualizar um uso
app.put("/usos/:id", (req, res) => {
    const id = Number(req.params.id)

    const indice = usosIA.findIndex(item => item.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Uso de IA não encontrado"
        })
    }

    usosIA[indice] = {
        id: id,
        sistema: req.body.sistema,
        tipo: req.body.tipo,
        finalidade: req.body.finalidade,
        tecnologia: req.body.tecnologia,
        nivel_risco: req.body.nivel_risco,
        possui_revisao_humana: req.body.possui_revisao_humana
    }

    salvarDados()

    res.json(usosIA[indice])
})

// DELETE - Excluir um uso
app.delete("/usos/:id", (req, res) => {
    const id = Number(req.params.id)

    const indice = usosIA.findIndex(item => item.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Uso de IA não encontrado"
        })
    }

    const excluido = usosIA.splice(indice, 1)

    salvarDados()

    res.json({
        mensagem: "Uso de IA excluído com sucesso",
        uso: excluido[0]
    })
})

// Função para salvar alterações no dados.json
function salvarDados() {
    fs.writeFileSync(
        "./dados.json",
        JSON.stringify(usosIA, null, 4)
    )
}

// Iniciar servidor
app.listen(PORTA, () => {
    console.log(`Servidor funcionando em http://localhost:${PORTA}`)
})