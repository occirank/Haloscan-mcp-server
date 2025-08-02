// index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// Configuration
let API_KEY = process.env.HALOSCAN_API_KEY || "";
const BASE_URL = "https://api.haloscan.com/api";
// Create an MCP server
const server = new McpServer({
    name: "Haloscan SEO",
    version: "1.0.0"
});
async function makeHaloscanRequest(endpoint, params = {}, method, apiKey) {
    const url = `${BASE_URL}${endpoint}`;
    try {
        let response;
        if (method.toUpperCase() === "GET") {
            response = await axios.get(url, {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "haloscan-api-key": apiKey,
                },
                params,
            });
        }
        else if (method.toUpperCase() === "POST") {
            response = await axios.post(url, params, {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "haloscan-api-key": apiKey,
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
const ToolsParams = z.object({
    lineCount: z.number().optional().describe("Max number of returned results."),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Whether the results are sorted in ascending or descending order."),
    volume_min: z.number().optional().describe(""),
    volume_max: z.number().optional().describe(""),
    cpc_min: z.number().optional().describe(""),
    cpc_max: z.number().optional().describe(""),
    competition_min: z.number().optional().describe(""),
    competition_max: z.number().optional().describe(""),
    kgr_min: z.number().optional().describe(""),
    kgr_max: z.number().optional().describe(""),
    kvi_min: z.number().optional().describe(""),
    kvi_max: z.number().optional().describe(""),
    kvi_keep_na: z.boolean().optional().describe(""),
    allintitle_min: z.number().optional().describe(""),
    allintitle_max: z.number().optional().describe(""),
    word_count_min: z.number().optional().describe(""),
    word_count_max: z.number().optional().describe(""),
    include: z.string().optional().describe(""),
    exclude: z.string().optional().describe("")
});
const getKeywordsOverview = z.object({
    keyword: z.string().describe("Seed keyword"),
    requested_data: z.array(z.string()).describe("Specific data fields to request").default(["keyword_match", "related_search", "related_question", "similar_category", "similar_serp", "top_sites", "similar_highlight", "categories", "synonyms", "metrics", "volume_history", "serp"]),
    lang: z.string().optional().describe("")
});
const getKeywordsMatch = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    exact_match: z.boolean().optional().describe(""),
});
const getKeywordsSimilar = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    similarity_min: z.number().optional().describe(""),
    similarity_max: z.number().optional().describe(""),
    score_min: z.number().optional().describe(""),
    score_max: z.number().optional().describe(""),
    p1_score_min: z.number().optional().describe(""),
    p1_score_max: z.number().optional().describe(""),
});
const getKeywordsHighlights = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    exact_match: z.boolean().optional().describe(""),
    similarity_min: z.number().optional().describe(""),
    similarity_max: z.number().optional().describe(""),
});
const getKeywordsRelated = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    exact_match: z.boolean().optional().describe(""),
    depth_min: z.number().optional().describe(""),
    depth_max: z.number().optional().describe(""),
});
const getKeywordsQuestions = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    exact_match: z.boolean().optional().describe(""),
    question_types: z.array(z.string()).optional().describe(""),
    keep_only_paa: z.boolean().optional().describe(""),
    depth_min: z.number().optional().describe(""),
    depth_max: z.number().optional().describe(""),
});
const getKeywordsSynonyms = ToolsParams.extend({
    keyword: z.string().describe("Seed keyword"),
    exact_match: z.boolean().optional().describe(""),
});
const getKeywordsFind = ToolsParams.extend({
    keyword: z.string().optional().describe("Seed keyword"),
    keywords: z.array(z.string()).optional().describe(""),
    keywords_sources: z.array(z.string()).optional().describe(""),
    keep_seed: z.boolean().optional().describe(""),
    exact_match: z.boolean().optional().describe(""),
});
const getKeywordsSiteStructure = z.object({
    keyword: z.string().optional().describe("Seed keyword"),
    keywords: z.array(z.string()).optional().describe(""),
    exact_match: z.boolean().optional().describe(""),
    neighbours_sources: z.array(z.string()).optional().describe(""),
    multipartite_modes: z.array(z.string()).optional().describe(""),
    neighbours_sample_max_size: z.number().optional().describe(""),
    mode: z.string().optional().describe(""),
    granularity: z.number().optional().describe(""),
    manual_common_10: z.number().optional().describe(""),
    manual_common_100: z.number().optional().describe(""),
});
const getKeywordsSerpCompare = z.object({
    keyword: z.string().describe("Seed keyword"),
    period: z.string().describe(""),
    first_date: z.string().optional().describe(""),
    second_date: z.string().optional().describe(""),
});
const getKeywordsSerpAvailableDates = z.object({
    keyword: z.string().describe("Seed keyword"),
});
const getKeywordsSerpPageEvolution = z.object({
    keyword: z.string().describe("Seed keyword"),
    first_date: z.string().describe(""),
    second_date: z.string().describe(""),
    url: z.string().describe(""),
});
const getKeywordsBulk = ToolsParams.extend({
    keywords: z.array(z.string()).describe(""),
    exact_match: z.boolean().optional().describe(""),
});
const getKeywordsScrap = z.object({
    keywords: z.array(z.string()).describe(""),
});
const DomainsToolsParams = z.object({
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe("Max number of returned results."),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Whether the results are sorted in ascending or descending order."),
    volume_min: z.number().optional().describe(""),
    volume_max: z.number().optional().describe(""),
    cpc_min: z.number().optional().describe(""),
    cpc_max: z.number().optional().describe(""),
    competition_min: z.number().optional().describe(""),
    competition_max: z.number().optional().describe(""),
    kgr_min: z.number().optional().describe(""),
    kgr_max: z.number().optional().describe(""),
    kvi_min: z.number().optional().describe(""),
    kvi_max: z.number().optional().describe(""),
    kvi_keep_na: z.boolean().optional().describe(""),
    allintitle_min: z.number().optional().describe(""),
    allintitle_max: z.number().optional().describe(""),
});
const getDomainsOverview = z.object({
    input: z.string().describe("Seed keyword"),
    mode: z.string().optional().describe(""),
    requested_data: z.array(z.string()).describe("Specific data fields to request"),
    lang: z.string().optional().describe("Seed keyword"),
});
const getDomainsPositions = DomainsToolsParams.extend({
    input: z.string().describe(""),
    traffic_min: z.number().optional().describe(""),
    traffic_max: z.number().optional().describe(""),
    position_min: z.number().optional().describe(""),
    position_max: z.number().optional().describe(""),
    keyword_word_count_min: z.number().optional().describe(""),
    keyword_word_count_max: z.number().optional().describe(""),
    serp_date_min: z.string().optional().describe(""),
    serp_date_max: z.string().optional().describe(""),
    keyword_include: z.string().optional().describe(""),
    keyword_exclude: z.string().optional().describe(""),
    title_include: z.string().optional().describe(""),
    title_exclude: z.string().optional().describe(""),
});
const getDomainsTopPages = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe("Max number of returned results."),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Whether the results are sorted in ascending or descending order."),
    known_versions_min: z.number().optional().describe(""),
    known_versions_max: z.number().optional().describe(""),
    total_traffic_min: z.number().optional().describe(""),
    total_traffic_max: z.number().optional().describe(""),
    unique_keywords_min: z.number().optional().describe(""),
    unique_keywords_max: z.number().optional().describe(""),
    total_top_3_min: z.number().optional().describe(""),
    total_top_3_max: z.number().optional().describe(""),
    total_top_10_min: z.number().optional().describe(""),
    total_top_10_max: z.number().optional().describe(""),
    total_top_50_min: z.number().optional().describe(""),
    total_top_50_max: z.number().optional().describe(""),
    total_top_100_max: z.number().optional().describe(""),
});
const getDomainsHistoryPositions = DomainsToolsParams.extend({
    input: z.string().describe(""),
    date_from: z.string().describe(""),
    date_to: z.string().describe(""),
    word_count_min: z.number().optional().describe(""),
    word_count_max: z.number().optional().describe(""),
    best_position_min: z.number().optional().describe(""),
    best_position_max: z.number().optional().describe(""),
    worst_position_min: z.number().optional().describe(""),
    worst_position_max: z.number().optional().describe(""),
    first_time_seen_min: z.string().optional().describe(""),
    first_time_seen_max: z.string().optional().describe(""),
    last_time_seen_min: z.string().optional().describe(""),
    last_time_seen_max: z.string().optional().describe(""),
    most_recent_position_min: z.number().optional().describe(""),
    most_recent_position_max: z.number().optional().describe(""),
    subdomain_count_min: z.number().optional().describe(""),
    subdomain_count_max: z.number().optional().describe(""),
    page_count_min: z.number().optional().describe(""),
    page_count_max: z.number().optional().describe(""),
    still_there: z.boolean().optional().describe(""),
    keyword_include: z.string().optional().describe(""),
    keyword_exclude: z.string().optional().describe(""),
});
const getDomainsHistoryPages = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe(""),
    date_from: z.string().describe(""),
    date_to: z.string().describe(""),
    lineCount: z.number().optional().describe("Max number of returned results."),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Whether the results are sorted in ascending or descending order."),
    known_versions_min: z.number().optional().describe(""),
    known_versions_max: z.number().optional().describe(""),
    total_traffic_min: z.number().optional().describe(""),
    total_traffic_max: z.number().optional().describe(""),
    unique_keywords_min: z.number().optional().describe(""),
    unique_keywords_max: z.number().optional().describe(""),
    total_top_3_min: z.number().optional().describe(""),
    total_top_3_max: z.number().optional().describe(""),
    total_top_10_min: z.number().optional().describe(""),
    total_top_10_max: z.number().optional().describe(""),
    total_top_50_min: z.number().optional().describe(""),
    total_top_50_max: z.number().optional().describe(""),
    total_top_100_min: z.number().optional().describe(""),
    total_top_100_max: z.number().optional().describe(""),
});
const getPageBestKeywords = z.object({
    input: z.array(z.string()).describe(""),
    lineCount: z.number().optional().describe(""),
    strategy: z.number().optional().describe(""),
});
const getDomainsKeywords = DomainsToolsParams.extend({
    input: z.string().describe(""),
    keywords: z.array(z.string()).describe(""),
    position_min: z.number().optional().describe(""),
    position_max: z.number().optional().describe(""),
    traffic_min: z.number().optional().describe(""),
    traffic_max: z.number().optional().describe(""),
    title_word_count_min: z.number().optional().describe(""),
    title_word_count_max: z.number().optional().describe(""),
    serp_date_min: z.string().optional().describe(""),
    serp_date_max: z.string().optional().describe(""),
    keyword_include: z.string().optional().describe(""),
    keyword_exclude: z.string().optional().describe(""),
    title_include: z.string().optional().describe(""),
    title_exclude: z.string().optional().describe(""),
});
const getDomainsBulk = z.object({
    inputs: z.array(z.string()).describe(""),
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe("Max number of returned results."),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Whether the results are sorted in ascending or descending order."),
    total_traffic_min: z.number().optional().describe(""),
    total_traffic_max: z.number().optional().describe(""),
    unique_keywords_min: z.number().optional().describe(""),
    unique_keywords_max: z.number().optional().describe(""),
    total_top_3_min: z.number().optional().describe(""),
    total_top_3_max: z.number().optional().describe(""),
    total_top_10_min: z.number().optional().describe(""),
    total_top_10_max: z.number().optional().describe(""),
    total_top_50_min: z.number().optional().describe(""),
    total_top_50_max: z.number().optional().describe(""),
    total_top_100_min: z.number().optional().describe(""),
    total_top_100_max: z.number().optional().describe(""),
});
const getDomainsCompetitors = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe(""),
    page: z.string().optional().describe(""),
});
const getDomainsCompetitorsKeywordsDiff = DomainsToolsParams.extend({
    input: z.string().describe(""),
    competitors: z.array(z.string()).optional().describe(""),
    exclusive: z.boolean().optional().describe(""),
    missing: z.boolean().optional().describe(""),
    besting: z.boolean().optional().describe(""),
    bested: z.boolean().optional().describe(""),
    acceptedTypes: z.array(z.string()).optional().describe(""),
    page: z.number().optional().describe(""),
    best_competitor_traffic_min: z.number().optional().describe(""),
    best_competitor_traffic_max: z.number().optional().describe(""),
    best_competitor_traffic_keep_na: z.boolean().optional().describe(""),
    best_reference_traffic_min: z.number().optional().describe(""),
    best_reference_traffic_max: z.number().optional().describe(""),
    best_reference_traffic_keep_na: z.boolean().optional().describe(""),
    best_reference_position_min: z.number().optional().describe(""),
    best_reference_position_max: z.number().optional().describe(""),
    competitors_positions_min: z.number().optional().describe(""),
    competitors_positions_max: z.number().optional().describe(""),
    unique_competitors_count_min: z.number().optional().describe(""),
    unique_competitors_count_max: z.number().optional().describe(""),
    keyword_word_count_min: z.number().optional().describe(""),
    keyword_word_count_max: z.number().optional().describe(""),
    keyword_include: z.number().optional().describe(""),
    keyword_exclude: z.number().optional().describe(""),
    volume_keep_na: z.boolean().optional().describe(""),
    cpc_keep_na: z.boolean().optional().describe(""),
    competition_keep_na: z.boolean().optional().describe(""),
    kgr_keep_na: z.boolean().optional().describe(""),
    allintitle_keep_na: z.boolean().optional().describe(""),
    google_indexed_min: z.number().optional().describe(""),
    google_indexed_max: z.number().optional().describe(""),
    google_indexed_keep_na: z.boolean().optional().describe(""),
});
const getDomainsCompetitorsBestPages = z.object({
    input: z.string().describe(""),
    competitors: z.array(z.string()).optional().describe(""),
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe(""),
    page: z.string().optional().describe(""),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    total_traffic_min: z.number().optional().describe(""),
    total_traffic_max: z.number().optional().describe(""),
    total_traffic_keep_na: z.boolean().optional().describe(""),
    positions_min: z.number().optional().describe(""),
    positions_max: z.number().optional().describe(""),
    keywords_min: z.number().optional().describe(""),
    keywords_max: z.number().optional().describe(""),
    exclusive_keywords_min: z.number().optional().describe(""),
    exclusive_keywords_max: z.number().optional().describe(""),
    besting_keywords_min: z.number().optional().describe(""),
    besting_keywords_max: z.number().optional().describe(""),
    bested_keywords_min: z.number().optional().describe(""),
    bested_keywords_max: z.number().optional().describe(""),
});
const getDomainsCompetitorsKeywordsBestPos = DomainsToolsParams.extend({
    competitors: z.array(z.string()).describe(""),
    keywords: z.array(z.string()).describe(""),
    best_competitor_traffic_min: z.number().optional().describe(""),
    best_competitor_traffic_max: z.number().optional().describe(""),
    best_competitor_traffic_keep_na: z.boolean().optional().describe(""),
    best_competitor_position_min: z.number().optional().describe(""),
    best_competitor_position_max: z.number().optional().describe(""),
    competitors_positions_min: z.number().optional().describe(""),
    competitors_positions_max: z.number().optional().describe(""),
    unique_competitors_count_min: z.number().optional().describe(""),
    unique_competitors_count_max: z.number().optional().describe(""),
    keyword_word_count_min: z.number().optional().describe(""),
    keyword_word_count_max: z.number().optional().describe(""),
    keyword_include: z.number().optional().describe(""),
    keyword_exclude: z.number().optional().describe(""),
    volume_keep_na: z.boolean().optional().describe(""),
    cpc_keep_na: z.boolean().optional().describe(""),
    competition_keep_na: z.boolean().optional().describe(""),
    kgr_keep_na: z.boolean().optional().describe(""),
    kvi_keep_na: z.boolean().optional().describe(""),
    allintitle_keep_na: z.boolean().optional().describe(""),
});
const getDomainsVisibilityTrends = z.object({
    input: z.array(z.string()).describe(""),
    mode: z.string().optional().describe(""),
    type: z.string().optional().describe(""),
});
const getDomainsExpired = z.object({
    keyword: z.string().optional().describe(""),
    lineCount: z.number().optional().describe(""),
    page: z.string().optional().describe(""),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    total_pages_min: z.number().optional().describe(""),
    total_pages_max: z.number().optional().describe(""),
    total_domains_min: z.number().optional().describe(""),
    total_domains_max: z.number().optional().describe(""),
    referring_domains_min: z.number().optional().describe(""),
    referring_domains_max: z.number().optional().describe(""),
    total_keywords_min: z.number().optional().describe(""),
    total_keywords_max: z.number().optional().describe(""),
    total_traffic_min: z.number().optional().describe(""),
    total_traffic_max: z.number().optional().describe(""),
    total_top_100_positions_min: z.number().optional().describe(""),
    total_top_100_positions_max: z.number().optional().describe(""),
    total_top_50_positions_min: z.number().optional().describe(""),
    total_top_50_positions_max: z.number().optional().describe(""),
    total_top_10_positions_min: z.number().optional().describe(""),
    total_top_10_positions_max: z.number().optional().describe(""),
    total_top_3_positions_min: z.number().optional().describe(""),
    total_top_3_positions_max: z.number().optional().describe(""),
    total_top_100_traffic_min: z.number().optional().describe(""),
    total_top_100_traffic_max: z.number().optional().describe(""),
    total_top_50_traffic_min: z.number().optional().describe(""),
    total_top_50_traffic_max: z.number().optional().describe(""),
    total_top_10_traffic_min: z.number().optional().describe(""),
    total_top_10_traffic_max: z.number().optional().describe(""),
    total_top_3_traffic_min: z.number().optional().describe(""),
    total_top_3_traffic_max: z.number().optional().describe(""),
    matching_keywords_min: z.number().optional().describe(""),
    matching_keywords_max: z.number().optional().describe(""),
    matching_pages_min: z.number().optional().describe(""),
    matching_pages_max: z.number().optional().describe(""),
    matching_traffic_min: z.number().optional().describe(""),
    matching_traffic_max: z.number().optional().describe(""),
    matching_most_recent_position_min: z.number().optional().describe(""),
    matching_most_recent_position_max: z.number().optional().describe(""),
    matching_top_100_positions_min: z.number().optional().describe(""),
    matching_top_100_positions_max: z.number().optional().describe(""),
    matching_top_50_positions_min: z.number().optional().describe(""),
    matching_top_50_positions_max: z.number().optional().describe(""),
    matching_top_10_positions_min: z.number().optional().describe(""),
    matching_top_10_positions_max: z.number().optional().describe(""),
    matching_top_3_positions_min: z.number().optional().describe(""),
    matching_top_3_positions_max: z.number().optional().describe(""),
    matching_top_100_traffic_min: z.number().optional().describe(""),
    matching_top_100_traffic_max: z.number().optional().describe(""),
    matching_top_50_traffic_min: z.number().optional().describe(""),
    matching_top_50_traffic_max: z.number().optional().describe(""),
    matching_top_10_traffic_min: z.number().optional().describe(""),
    matching_top_10_traffic_max: z.number().optional().describe(""),
    matching_top_3_traffic_min: z.number().optional().describe(""),
    matching_top_3_traffic_max: z.number().optional().describe(""),
    matching_count_min: z.number().optional().describe(""),
    matching_count_max: z.number().optional().describe(""),
    count_min: z.number().optional().describe(""),
    count_max: z.number().optional().describe(""),
});
const getDomainsExpiredReveal = z.object({
    root_domain_keys: z.array(z.number()).describe("Seed keyword")
});
const getDomainsGMBBacklins = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe(""),
    lineCount: z.number().optional().describe(""),
    page: z.string().optional().describe(""),
    order_by: z.string().optional().describe("Field used for sorting results. Default sorts by descending volume."),
    order: z.string().optional().describe(""),
    rating_count_min: z.number().optional().describe(""),
    rating_count_max: z.number().optional().describe(""),
    rating_count_keep_na: z.boolean().optional().describe(""),
    rating_value_min: z.number().optional().describe(""),
    rating_value_max: z.number().optional().describe(""),
    rating_value_keep_na: z.boolean().optional().describe(""),
    latitude_min: z.number().optional().describe(""),
    latitude_max: z.number().optional().describe(""),
    latitude_keep_na: z.boolean().optional().describe(""),
    longitude_min: z.number().optional().describe(""),
    longitude_max: z.number().optional().describe(""),
    longitude_keep_na: z.boolean().optional().describe(""),
    categories_include: z.number().optional().describe(""),
    categories_exclude: z.number().optional().describe(""),
    is_claimed: z.boolean().optional().describe(""),
});
const getDomainsGmbBacklinksMap = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe("")
});
const getDomainsGmbBacklinksCategories = z.object({
    input: z.string().describe(""),
    mode: z.string().optional().describe("")
});
// Configuration function that adds all tools and prompts to a server instance
export function configureHaloscan(server) {
    // Tool to get user credits
    server.tool("get_user_credit", "Obtenir les informations de crédit de l'utilisateur.", async () => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/user/credit", {}, "GET", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting user credits: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords overview
    server.tool("get_keywords_overview", "Obtenir un aperçu des mots-clés.", getKeywordsOverview.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/overview", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords overview: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords match
    server.tool("get_keywords_match", "Obtenir la correspondance des mots-clés.", getKeywordsMatch.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/match", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords match: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords similar
    server.tool("get_keywords_similar", "Obtenir la correspondance des mots-clés.", getKeywordsSimilar.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/similar", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords similar: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords highlights
    server.tool("get_keywords_highlights", "Obtenir les points forts des mots-clés.", getKeywordsHighlights.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/highlights", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords highlights: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords related
    server.tool("get_keywords_related", "Obtenir les mots-clés associés.", getKeywordsRelated.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/related", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords related: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords questions
    server.tool("get_keywords_questions", "Obtenir les questions liées aux mots-clés.", getKeywordsQuestions.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/questions", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords questions: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords synonyms
    server.tool("get_keywords_synonyms", "Obtenir les synonymes des mots-clés.", getKeywordsSynonyms.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/synonyms", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords synonyms: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords find
    server.tool("get_keywords_find", "Trouver des mots-clés.", getKeywordsFind.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/find", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords find: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords site structure
    server.tool("get_keywords_site_structure", "Obtenir la structure du site des mots-clés.", getKeywordsSiteStructure.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/siteStructure", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords site structure: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords serp compare
    server.tool("get_keywords_serp_compare", "Comparer les mots-clés dans les SERP.", getKeywordsSerpCompare.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/serpCompare", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords serp compare: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords serp available dates
    server.tool("get_keywords_serp_availableDates", "Obtenir les dates disponibles des mots-clés dans les SERP.", getKeywordsSerpAvailableDates.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/serp/availableDates", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords serp availableDates: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords serp available dates
    server.tool("get_keywords_serp_pageEvolution", "Obtenir l'évolution des pages SERP des mots-clés.", getKeywordsSerpPageEvolution.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/serp/pageEvolution", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords serp pageEvolution: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords bulk
    server.tool("get_keywords_bulk", "Obtenir des mots-clés en masse.", getKeywordsBulk.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/bulk", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords bulk: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get keywords scrap
    server.tool("get_keywords_scrap", "Extraire les mots-clés.", getKeywordsScrap.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/keywords/scrap", params, "POST", apiKey);
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting keywords scrap: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains overview
    server.tool("get_domains_overview", "Obtenir un aperçu des domaines.", getDomainsOverview.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/overview", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains overview: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains positions
    server.tool("get_domains_positions", "Obtenir les positions des domaines.", getDomainsPositions.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/positions", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains positions: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains top pages
    server.tool("get_domains_top_pages", "Obtenir les pages principales des domaines.", getDomainsTopPages.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/topPages", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains top pages: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains history positions
    server.tool("get_domains_history_positions", "Obtenir l’historique des positions des domaines.", getDomainsHistoryPositions.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/history", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains history positions: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains history pages
    server.tool("get_domains_history_pages", "Obtenir l’historique des positions des domaines.", getDomainsHistoryPages.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/pagesHistory", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains history pages: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get page best keywords
    server.tool("get_page_best_keywords", "Obtenir les meilleurs mots-clés de la page.", getPageBestKeywords.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/pageBestKeywords", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting page best keywords: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains keywords
    server.tool("get_domains_keywords", "Obtenir les mots-clés des domaines.", getDomainsKeywords.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/keywords", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains keywords: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains bulk
    server.tool("get_domains_bulk", "Obtenir des domaines en masse.", getDomainsBulk.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/bulk", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains bulk: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains competitors
    server.tool("get_domains_competitors", "Obtenir les concurrents des domaines.", getDomainsCompetitors.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains competitors: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains competitors keywords diff
    server.tool("get_domains_competitors_keywords_diff", "Obtenir la différence de mots-clés entre les domaines et leurs concurrents.", getDomainsCompetitorsKeywordsDiff.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors/keywordsDiff", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains competitors keywords diff: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains competitors best pages
    server.tool("get_domains_competitors_best_pages", "Obtenir les meilleures pages des concurrents des domaines.", getDomainsCompetitorsBestPages.shape, // <- pass the raw shape
    async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/siteCompetitors/bestPages", params, "POST", apiKey);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error getting domains competitors best pages: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Tool to get domains competitors keywords best pos
    server.tool("get_domains_competitors_keywords_best_pos", "Obtenir les meilleures positions des mots-clés des concurrents des domaines.", getDomainsCompetitorsKeywordsBestPos.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("domains/ /keywordsBestPos", params, "POST", apiKey);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains competitors keywords best pos: ${error instanceof Error ? error.message : String(error)}`
                    }],
            };
        }
    });
    // Tool to get domains visibility trends
    server.tool("get_domains_visibility_trends", "Obtenir les tendances de visibilité des domaines.", getDomainsVisibilityTrends.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/history/visibilityTrends", params, "POST", apiKey);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains visibility trends: ${error instanceof Error ? error.message : String(error)}`
                    }],
            };
        }
    });
    // Tool to get domains expired
    server.tool("get_domains_expired", "Obtenir les domaines expirés.", getDomainsExpired.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/expired", params, "POST", apiKey);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [{
                        type: "text",
                        text: `Error getting domains expired: ${error instanceof Error ? error.message : String(error)}`
                    }],
            };
        }
    });
    // Tool to get domains expired reveal 
    server.tool("get_domains_expired_reveal", "Révéler les domaines expirés.", getDomainsExpiredReveal.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/expired/reveal", params, "POST", apiKey);
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
    server.tool("get_domains_gmb_backlinks", "Obtenir les backlinks des domaines GMB.", getDomainsGMBBacklins.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks", params, "POST", apiKey);
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
    server.tool("get_domains_gmb_backlinks_map", "Obtenir la carte des backlinks des domaines GMB.", getDomainsGmbBacklinksMap.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks/map", params, "POST", apiKey);
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
    server.tool("get_domains_gmb_backlinks_categories", "Obtenir les catégories des backlinks des domaines GMB.", getDomainsGmbBacklinksCategories.shape, async (params) => {
        const apiKey = API_KEY;
        if (!apiKey) {
            return {
                isError: true,
                content: [{ type: "text", text: "API key not found (session or env)" }],
            };
        }
        try {
            const data = await makeHaloscanRequest("/domains/gmbBacklinks/categories", params, "POST", apiKey);
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
}
// Configure the server with Haloscan tools and prompts
configureHaloscan(server);
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Haloscan MCP Server running on stdio...");
