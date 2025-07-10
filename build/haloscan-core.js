import { z } from "zod";
import axios from "axios";
// Configuration
let API_KEY = process.env.HALOSCAN_API_KEY || "";
const BASE_URL = "https://api.haloscan.com/api";
// Helper function to make API calls (GET or POST)
async function makeHaloscanRequest(endpoint, params = {}, method) {
    if (!API_KEY) {
        throw new Error("HALOSCAN_API_KEY is not set");
    }
    const url = `${BASE_URL}${endpoint}`;
    try {
        let response;
        // If method is GET, we use axios.get
        if (method.toUpperCase() === "GET") {
            response = await axios.get(url, {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "haloscan-api-key": API_KEY,
                },
                params, // GET parameters passed as query strings
            });
        }
        // If method is POST, we use axios.post
        else if (method.toUpperCase() === "POST") {
            response = await axios.post(url, params, {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "haloscan-api-key": API_KEY,
                },
            });
        }
        else {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        return response.data;
    }
    catch (error) {
        console.error("Error making Haloscan request:", error);
        throw error;
    }
}
// Configuration function that adds all tools and prompts to a server instance
export function configureHaloscanServer(server) {
    // Tool to set API key
    server.tool("set_api_key", "Définir la clé API.", {
        apiKey: z.string().describe("Your Haloscan API key")
    }, async ({ apiKey }) => {
        API_KEY = apiKey;
        return {
            content: [{ type: "text", text: "API key set successfully" }]
        };
    });
    // Tool to get user credits
    server.tool("get_user_credit", "Obtenir les informations de crédit de l'utilisateur.", async () => {
        try {
            const data = await makeHaloscanRequest("/user/credit", {}, "GET");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting user credits: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords overview
    server.tool("get_keywords_overview", "Obtenir un aperçu des mots-clés.", {
        keyword: z.string().describe("Seed keyword"),
        requested_data: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ keyword, requested_data }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/overview", {
                keyword,
                requested_data
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords overview: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords match
    server.tool("get_keywords_match", "Obtenir la correspondance des mots-clés.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/match", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords match: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords similar
    server.tool("get_keywords_similar", "Obtenir des mots-clés similaires.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/similar", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords similar: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords highlights
    server.tool("get_keywords_highlights", "Obtenir les points forts des mots-clés.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/highlights", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords highlights: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords related
    server.tool("get_keywords_related", "Obtenir les mots-clés associés.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/related", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords related: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords questions
    server.tool("get_keywords_questions", "Obtenir les questions liées aux mots-clés.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/questions", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords questions: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords synonyms
    server.tool("get_keywords_synonyms", "Obtenir les synonymes des mots-clés.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/synonyms", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords synonyms: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords find 
    server.tool("get_keywords_find", "Trouver des mots-clés.", {
        keyword: z.string().describe("Seed keyword").optional(),
        keywords: z.array(z.string()).describe("Seed keyword").optional(),
        keywords_sources: z.array(z.string()).describe("Seed keyword").optional()
    }, async ({ keyword, keywords, keywords_sources }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/find", {
                keyword,
                keywords,
                keywords_sources
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error finding keywords: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords site structure
    server.tool("get_keywords_site_structure", "Obtenir la structure du site des mots-clés.", {
        keyword: z.string().describe("Seed keyword").optional(),
        keywords: z.array(z.string()).describe("Seed keyword").optional()
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/siteStructure", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords site structure: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords serp compare
    server.tool("get_keywords_serp_compare", "Comparer les mots-clés dans les SERP.", {
        keyword: z.string().describe("Seed keyword"),
        period: z.string().describe("Seed keyword")
    }, async ({ keyword, period }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/serp/compare", {
                keyword,
                period
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords serp compare: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords serp available dates
    server.tool("get_keywords_serp_availableDates", "Obtenir les dates disponibles des mots-clés dans les SERP.", {
        keyword: z.string().describe("Seed keyword")
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/serp/availableDates", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords serp available dates: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords serp page evolution
    server.tool("get_keywords_serp_pageEvolution", "Obtenir l'évolution des pages SERP des mots-clés.", {
        keyword: z.string().describe("Seed keyword"),
        first_date: z.string().describe("Seed keyword"),
        second_date: z.string().describe("Seed keyword"),
        url: z.string().describe("Seed keyword")
    }, async ({ keyword, first_date, second_date, url }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/serp/pageEvolution", {
                keyword,
                first_date,
                second_date,
                url
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords serp page evolution: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords bulk
    server.tool("get_keywords_bulk", "Obtenir des mots-clés en masse.", {
        keywords: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ keywords }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/bulk", {
                keywords
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords bulk: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get keywords scrap
    server.tool("get_keywords_scrap", "Extraire les mots-clés.", {
        keywords: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ keywords }) => {
        try {
            const data = await makeHaloscanRequest("/keywords/scrap", {
                keywords
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting keywords scrap: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains overview
    server.tool("get_domains_overview", "Obtenir un aperçu des domaines.", {
        input: z.string().describe("Seed keyword"),
        requested_data: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input, requested_data }) => {
        try {
            const data = await makeHaloscanRequest("/domains/overview", {
                input,
                requested_data
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains overview: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains positions
    server.tool("get_domains_positions", "Obtenir les positions des domaines.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/positions", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains positions: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains top pages
    server.tool("get_domains_top_pages", "Obtenir les pages principales des domaines.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/topPages", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains top pages: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains history positions
    server.tool("get_domains_history_positions", "Obtenir l’historique des positions des domaines.", {
        input: z.string().describe("Seed keyword"),
        date_from: z.string().describe("Seed keyword"),
        date_to: z.string().describe("Seed keyword")
    }, async ({ input, date_from, date_to }) => {
        try {
            const data = await makeHaloscanRequest("/domains/history", {
                input,
                date_from,
                date_to
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains history positions: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains history pages
    server.tool("get_domains_history_pages", "Obtenir l’historique des pages des domaines.", {
        input: z.string().describe("Seed keyword"),
        date_from: z.string().describe("Seed keyword"),
        date_to: z.string().describe("Seed keyword")
    }, async ({ input, date_from, date_to }) => {
        try {
            const data = await makeHaloscanRequest("/domains/pagesHistory", {
                input,
                date_from,
                date_to
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains history pages: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get page best keywords
    server.tool("get_page_best_keywords", "Obtenir les meilleurs mots-clés de la page.", {
        input: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/pageBestKeywords", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting page best keywords: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains keywords
    server.tool("get_domains_keywords", "Obtenir les mots-clés des domaines.", {
        input: z.string().describe("Seed keyword"),
        keywords: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input, keywords }) => {
        try {
            const data = await makeHaloscanRequest("/domains/keywords", {
                input,
                keywords
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains keywords: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains bulk
    server.tool("get_domains_bulk", "Obtenir des domaines en masse.", {
        inputs: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ inputs }) => {
        try {
            const data = await makeHaloscanRequest("/domains/bulk", {
                inputs
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains bulk: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains competitors
    server.tool("get_domains_competitors", "Obtenir les concurrents des domaines.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains competitors: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains competitors keywords diff
    server.tool("get_domains_competitors_keywords_diff", "Obtenir la différence de mots-clés entre les domaines et leurs concurrents.", {
        input: z.string().describe("Seed keyword"),
        competitors: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input, competitors }) => {
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors/keywordsDiff", {
                input,
                competitors
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains competitors keywords diff: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains competitors best pages
    server.tool("get_domains_competitors_best_pages", "Obtenir les meilleures pages des concurrents des domaines.", {
        input: z.string().describe("Seed keyword"),
        competitors: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input, competitors }) => {
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors/keywordsDiff", {
                input,
                competitors
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains competitors best pages: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains visibility trends
    server.tool("get_domains_visibility_trends", "Obtenir les tendances de visibilité des domaines.", {
        input: z.array(z.string()).describe("Specific data fields to request")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/history/visibilityTrends", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains visibility trends: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains expired
    server.tool("get_domains_expired", "Obtenir les domaines expirés.", {
        keyword: z.string().describe("Seed keyword").optional()
    }, async ({ keyword }) => {
        try {
            const data = await makeHaloscanRequest("/domains/expired", {
                keyword
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains expired: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains expired reveal
    server.tool("get_domains_expired_reveal", "Révéler les domaines expirés.", {
        root_domain_keys: z.array(z.number()).describe("Seed keyword")
    }, async ({ root_domain_keys }) => {
        try {
            const data = await makeHaloscanRequest("/domains/expired/reveal", {
                root_domain_keys
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains expired reveal: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains gmb backlinks
    server.tool("get_domains_gmb_backlinks", "Obtenir les backlinks des domaines GMB.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains gmb backlinks: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains gmb backlinks map
    server.tool("get_domains_gmb_backlinks_map", "Obtenir la carte des backlinks des domaines GMB.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks/map", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains gmb backlinks map: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Tool to get domains gmb backlinks categories
    server.tool("get_domains_gmb_backlinks_categories", "Obtenir les catégories des backlinks des domaines GMB.", {
        input: z.string().describe("Seed keyword")
    }, async ({ input }) => {
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks/categories", {
                input
            }, "POST");
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains gmb backlinks categories: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    });
    // Define some helpful prompts
    server.prompt("seo_audit", "Generate an SEO audit for a website.", {
        domain: z.string().describe("Website domain to audit"),
    }, ({ domain }) => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Please perform a comprehensive SEO audit for ${domain}. Start by using the domain_metrics tool to get an overview, then analyze backlinks with the backlink_data tool. Finally, provide actionable recommendations based on the findings.`
                }
            }]
    }));
    server.prompt("keyword_research", "Conduct keyword research for a topic", {
        topic: z.string().describe("Topic to research keywords for"),
    }, ({ topic }) => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Please conduct keyword research for the topic "${topic}". Use the keyword_suggestions tool to find related keywords, then analyze their difficulty with the keyword_difficulty tool. Organize the results by search volume and group them into clusters of related terms. Finally, recommend the top 5 keywords to target based on a balance of search volume and competition.`
                }
            }]
    }));
    server.prompt("content_optimization", "Get content optimization suggestions", {
        content: z.string().describe("Content to optimize"),
        keyword: z.string().describe("Target keyword"),
    }, ({ content, keyword }) => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Please analyze this content and provide optimization suggestions for the target keyword "${keyword}". Use the content_analysis tool to evaluate the current content, then provide specific recommendations to improve keyword density, readability, and overall SEO performance.`
                }
            }]
    }));
}
