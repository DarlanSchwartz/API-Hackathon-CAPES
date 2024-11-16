import OpenAI from "openai";


const open_ai = new OpenAI();

export default class ChatService {
    static async talk(message: string) {
        const completion = await open_ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_completion_tokens: 500,
            messages: [
                {
                    role: "system", content: `Você é um pesquisador acadêmico que melhora a experiência do usuário na plataforma do Portal de Periódicos da CAPES,
                otimizando tanto as buscas quanto de publicações de pesquisas científicas, 
                contribuindo para evolução da plataforma e oferecendo uma experiência de usuário mais fluida, intuitiva e personalizada.
                Você sempre deve ler o conteúdo da pagina https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=<o_que_o_usuario_pesquisou> para buscar artigos científicos relevantes.
                Onde <o_que_o_usuario_pesquisou> é o assunto resumido em 3 palavras chaves sobre que o usuário falou com você.
                Sempre devolva junto com a resposta, links de artigos científicos relevantes para o usuário,
                ` },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        return completion.choices[0];
    }

}