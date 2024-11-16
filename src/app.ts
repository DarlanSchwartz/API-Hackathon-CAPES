import express, { json } from "express";
import "express-async-errors";
import cors from 'cors';
import MainRouter from "./routes/index.routes";
import OpenAI from "openai";

import axios from 'axios';
import * as cheerio from 'cheerio';

const openai = new OpenAI();

const app = express();

app.use(cors());
app.use(json());
app.use(MainRouter);
// app.use(ErrorCatcher);
const PORT = process.env.PORT || 5000;

async function startChatGPT() {
  const completion = await openai.chat.completions.create({
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
        content: "Me de links artigos sobre revolução francesa",
      },
    ],
  });
  console.log(JSON.stringify(completion, null, 2));
}

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

// Exemplo de uso:
// const url = 'https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=revolução';
// scrapeArticles(url).then(articles => {
//   let allLinks = new Set<string>();
//   articles.forEach(article => {
//     article.links.forEach(link => allLinks.add(link.url));
//   });
//   const links = removeDuplicateLinks(Array.from(allLinks));
//   console.log(links);
// });



app.listen(PORT, () => {
  console.log(`--------------- Server is up and running on port ${PORT}`);
  startChatGPT();
});