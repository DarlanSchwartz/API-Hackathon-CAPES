import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";


interface Article {
    title: string;
    authors: string[];
    links: { title: string; url: string; }[];
}

async function scrapeArticles(url: string): Promise<Article[]> {
    try {
        const response = await axios.get(url);
        const html = response.data;

        // Carregar o conteúdo HTML com cheerio
        const $ = cheerio.load(html);
        const articles: Article[] = [];

        // Selecionar todas as seções de artigos dentro de '#resultados'
        $('#resultados .result-busca').each((_index, element) => {
            const title = $(element).find('.titulo-busca').text().trim();

            // Extrair autores
            const authors: string[] = $(element)
                .find('.col-md-12 p.small b')
                .text()
                .split(',')
                .map(author => author.trim());

            // Extrair links
            const links: { title: string; url: string; }[] = [];
            $(element)
                .find('a')
                .each((_i, link) => {
                    const linkTitle = $(link).text().trim();
                    const linkUrl = $(link).attr('href');
                    if (linkUrl && linkUrl.startsWith('http')) {
                        links.push({ title: linkTitle, url: linkUrl });
                    }
                });

            articles.push({ title, authors, links });
        });

        return articles;
    } catch (error) {
        console.error('Erro ao fazer scraping:', error);
        return [];
    }
}

function removeDuplicateLinks(links: string[]): string[] {
    const doiPattern = /(?:doi\.org\/|doi=|\/doi\/)(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i;
    const uniqueLinks = new Map<string, string>();

    links.forEach(link => {
        // Extrai o identificador DOI usando a expressão regular
        const match = link.match(doiPattern);
        if (match) {
            const doi = match[1].toLowerCase(); // Normaliza o DOI para evitar duplicação por diferenças de maiúsculas/minúsculas
            if (!uniqueLinks.has(doi)) {
                uniqueLinks.set(doi, link);
            }
        } else {
            // Se não for um link com DOI, adiciona diretamente
            uniqueLinks.set(link, link);
        }
    });

    return Array.from(uniqueLinks.values());
}

const userHistory: { userId: string, messages: { role: any, content: string | OpenAI.Chat.Completions.ChatCompletionContentPart[]; }[]; }[] = [];

const open_ai = new OpenAI();

export default class ChatService {
    static async readPage(url: string) {
        const pageResume = await open_ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Leia a página ${url} e resuma o conteúdo dela em no máximo 3 parágrafos e um título, e no final insira o link da página como sendo a fonte da informação.` }],
            max_tokens: 500,
        });
        return pageResume.choices[0].message.content;
    }
    static async talk(message: string | OpenAI.Chat.Completions.ChatCompletionContentPart[], userId: string, file?: Express.Multer.File) {
        if (userHistory.find(user => user.userId === userId)) {
            const user = userHistory.find(user => user.userId === userId);
            user?.messages.push({ role: "user", content: message });
        }
        const previousMessages = userHistory.find(user => user.userId === userId)?.messages;
        const userMessageSubject = await open_ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_completion_tokens: 500,
            user: userId,
            messages: [
                {
                    role: "system",
                    content: `
                        caso o usuário esteja falando sobre algum assunto acadêmico , pesquisas cientificas , pedindo referencias de artigos ou periódicos
                        identifique o assunto principal do usuário em no máximo 2 palavras chaves, pegue somente as mais relevantes
                        e me responda com as palavra chaves no formato: [palavra1,palavra2] , do contrario responda com "no",
                        por exemplo: Usuário diz - eu quero saber sobre carros
                        Resposta - carros
                        Usuário diz - eu quero saber sobre a teoria da relatividade
                        Resposta - relatividade
                    `
                },
                {
                    role: "user",
                    content: message,
                }
            ],
        });

        const messageContent = userMessageSubject.choices[0].message.content;
        const isAcademic = messageContent?.trim() !== "no";

        if (isAcademic) {
            const subjectKeywords = messageContent?.trim().replaceAll("[", "").replaceAll("]", "").replaceAll(",", " ").replaceAll("  ", " ").replaceAll(" ", "%20");
            const url = `https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=${subjectKeywords}`;
            console.log("Searched in URL:", url);
            const articles = await scrapeArticles(url);
            // console.log("Articles:", articles);
            let allLinks = new Set<string>();
            articles.forEach(article => {
                article.links.forEach(link => allLinks.add(link.url));
            });
            const links = removeDuplicateLinks(Array.from(allLinks));
            // console.log("Links:", links);


            const availableLinks: string[] = [];
            const resumes: string[] = [];

            for (const link of links) {
                try {
                    const response = await axios.get(link);
                    if (response.status === 200) {
                        if (availableLinks.length >= 3) break;
                        availableLinks.push(link);
                    }
                } catch (error) {
                    console.error(`Erro ao abrir o link ${link}:`);
                }
            }
            // console.log("Available links:", availableLinks);



            if (availableLinks.length > 0) {
                for (const link of availableLinks) {
                    const resume = await this.readPage(link);
                    if (resume) {
                        resumes.push(resume);
                    }
                }
            }



            //     console.log("Available links:", availableLinks);
            console.log("Resumes:", resumes);

            const finalResume = await open_ai.chat.completions.create({
                model: "gpt-3.5-turbo",
                user: userId,
                messages: [
                    {
                        role: "system",
                        content: `Faça um resumo dos artigos científicos encontrados e insira o link no título do resumo.
                        Inclua somente os resumos que tenham palavras chave ou haver com : '${message ?? "ignore"}' e no final insira o link da página como sendo a fonte da informação.
                         caso nao haja resumos ou os resumos não tenham haver com: '${message ?? "ignore"}' por favor me responda com o que você souber sobre o assunto.
                         Nunca responda que os resumos não tem haver com o assunto ou que não foram encontrados, sempre responda com o que você souber sobre o assunto.
                        Por exemplo: Nunca inclua na sua resposta algo como:
                        Infelizmente, os resumos dos artigos científicos encontrados não possuem relação com as palavras-chave
                        Sempre use markdown para formatar a sua resposta.
                         
                         `
                    },
                    {
                        role: "user",
                        content: `Resumos: ${resumes.join("\n")}`
                    }
                ]
            });
            return finalResume.choices[0];
        }

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `Você é um pesquisador acadêmico que melhora a experiência do usuário na plataforma do Portal de Periódicos da CAPES,
                otimizando tanto as buscas quanto de publicações de pesquisas científicas, 
                contribuindo para evolução da plataforma e oferecendo uma experiência de usuário mais fluida, intuitiva e personalizada.
                `
            },
            ...previousMessages ?? [],
            {
                role: "user",
                content: message,
            }
        ];

        if (file) {
            messages.push({
                role: "user",
                content: file.buffer.toString("base64")
            });
        }
        const completion = await open_ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_completion_tokens: 500,
            user: userId,
            messages: messages,
        });

        return completion.choices[0];
    }

}