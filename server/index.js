import process from 'process';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); 

const app = express();

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
app.use(express.static(webRoot));

async function getGroqChatCompletion(message) {
    return groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Você é um assistente de IA sobre desenvolvimento humano e carreira e deve auxiliar o usuário a entender os cursos e trilhas de carreira disponíveis, além de fornecer informações sobre o mercado de trabalho e dicas para crescimento profissional.',    
            },
            {
                role: 'user',
                content: message,
            },
        ],
        model: 'llama-3.3-70b-versatile',
    });
}

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "O campo message é obrigatório." });
    }

    try {
        const responseGroq = await getGroqChatCompletion(message);
        return res.json({ 
            response: responseGroq.choices[0]?.message?.content || "Sem resposta da IA." 
        });
    } catch (error) {
        console.error("Erro no Groq:", error);
        return res.status(500).json({ error: "Erro interno ao processar a mensagem." });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});

export default app;
