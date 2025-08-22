import { newsapi } from "../config/newsapi";

export async function fetchArticles(query) {
    const API_KEY = newsapi.api_token;
    const url = newsapi.base_url;

    try {
        const res = await fetch(
            `${url}${query}&language=en&domains=wsj.com,bloomberg.com,cnbc.com,ft.com,forbes.com&sortBy=publishedAt&apiKey=${API_KEY}`
        );
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}