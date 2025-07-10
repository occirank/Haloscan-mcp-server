# Haloscan MCP Server

A Model Context Protocol (MCP) server for interacting with the Haloscan SEO API.  
This server allows easy integration with Claude for Desktop, N8N, and other MCP-compatible clients.



## Features

- Exposes Haloscan SEO API functionality through MCP tools
- Provides prompts for common SEO tasks
- Easy integration with workflow automation tools like N8N


## Tools

#### 1. User Tools

  - **get_user_credit**<br>
    - Retrieves the remaining credit for the user identified by the provided API key.<br>

#### 2. Keyword Explorer Tools
  - **get_keywords_overview**<br>
    - Retrieves an overview of a specific keyword, providing key performance indicators such as search volume, competition level, and trends over time.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword.<br>
        - `requested_data` (string[]): Any combination of [keyword_match, related_search, related_question, similar_category, similar_serp, top_sites, similar_highlight, categories, synonyms, metrics, volume_history, serp ].<br>

  - **get_keywords_match**<br>
    - Retrieves keyword data based on an exact match search, providing detailed insights into how the specific keyword performs in search engines.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_similar**<br>
    - Retrieves the list of keywords that are semantically or topically similar to a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_highlights**<br>
    - Retrieves the key performance highlights from a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_related**<br>
    - Retrieves the list of keywords that are contextually or topically related to a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_questions**<br>
    - Retrieves a list of question-based keywords related to a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_synonyms**<br>
    - Retrieves a list of synonyms related to a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_find**<br>
    - Retrieves comprehensive data for a given keyword or list of keywords, including search volume, competition, and trend analysis.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword.<br>
        - `keywords` (string[]): Requested keywords.<br>
        - `keywords_sources` (string[]): Which strategies to use to find keywords from input (Any combination of [match, serp, related, highlights, categories, questions]).<br>

  - **get_keywords_site_structure**<br>
    - Retrieves the site structure data for a given domain, including the keywords associated with the site's pages, hierarchical organization, and relevant metadata for SEO optimization.<br>
    - Input:<br> 
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_serp_compare**<br>
    - Retrieves a comparison of search engine results pages (SERP) for two or more keywords, providing insights into how they perform in search rankings.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword.<br>
        - `period` (string): The comparison period for SERPs (1 month, 3 months, 6 months, 12 months, custom).<br>

  - **get_keywords_serp_availableDates**<br>
    - Retrieves the available dates for historical SERP data of a given keyword at a given period.<br>
    - Input:<br> 
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_serp_pageEvolution**<br>
    - Retrieves the evolution of SERP rankings for a specific keyword over time, showing how a page's position in search results has changed.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword.<br>
        - `first_date` (string): Date in YYYY-MM-DD format.<br>
        - `second_date` (string): Date in YYYY-MM-DD format.<br>
        - `url` (string)<br>

  - **get_keywords_bulk**<br>
    - Retrieves keyword data for multiple keywords at once in a bulk request.<br>
    - Input:<br> 
        - `keywords` (string[]): Array containing the requested keywords.<br>

  - **get_keywords_scrap**<br>
    - Retrieves keyword data by scraping the search engine results pages (SERP) for a given keyword.<br>
    - Input:<br>
        - `keywords` (string[]): Array containing the requested keywords.<br>

#### 3. Site Explorer Tools
  - **get_domains_overview**<br>
    - Retrieves a comprehensive SEO performance summary for a specific domain.<br>
    - Inputs:<br>
        - `input` (string): Requested url, domain or root domain.<br>
        - `requested_data` (string[]): Requested data for the given url or domain, corresponding to the content of different sections of the haloscan overview page.<br>

  - **get_domains_positions**<br>
    - Retrieves the search engine ranking positions of a specified domain for one or more keywords.<br>
    - Input:<br>
        - `input` (string): Requested url, domain or root domain.<br>

  - **get_domains_top_pages**<br>
    - Retrieves the top-performing pages of a specified domain based on organic search metrics such as traffic, number of ranking keywords, and visibility.<br>
    - Input:<br>
        - `input` (string): Requested url, domain or root domain.<br>

  - **get_domains_history_positions**<br>
    - Retrieves historical ranking positions for a specific domain across selected keywords.<br>
    - Inputs:<br>
        - `input` (string): Requested url or domain.<br>
        - `date_from` (string): Date in YYYY-MM-DD format.<br>
        - `date_to` (string): Date in YYYY-MM-DD format.<br>

  - **get_domains_history_pages**<br>
    - Retrieves historical SEO performance data for the top pages of a specified domain.<br>
    - Inputs:<br>
        - `input` (string): Requested url or domain.<br>
        - `date_from` (string): Date in YYYY-MM-DD format.<br>
        - `date_to` (string): Date in YYYY-MM-DD format.<br>

  - **get_page_best_keywords**<br>
    - Retrieves the top-performing keywords for a specific URL, showing which search queries drive the most traffic and visibility to that page.<br>
    - Input:<br>
        - `input` (string[]): Requested urls.<br>
        
  - **get_domains_keywords**<br>
    - Retrieves all the keywords a domain ranks for in organic search results, along with their associated metrics such as ranking position, traffic, and search volume.<br>
    - Inputs:<br>
        - `input` (string): Requested url or domain.<br>
        - `keywords` (string[]): Array containing the requested keywords.<br>

  - **get_domains_bulk**<br>
    - Retrieves SEO performance metrics for multiple domains in a single request.<br>
    - Input:<br>
        - `inputs` (string[]): Array containing the requested urls or domains.<br>

  - **get_domains_competitors**<br>
    - Retrieves a list of organic search competitors for a given domain based on overlapping keywords.<br>
    - Input:<br>
        - `input` (string): Requested url or domain.<br>

  - **get_domains_competitors_keywords_diff**<br>
    - Compares the keyword differences between a given domain and its competitors, highlighting keywords that one domain ranks for but the other does not.<br>
    - Inputs:<br>
        - `input` (string): Requested url or domain.<br>
        - `competitors` (string[]): List of competitors to compare the input to.<br>

  - **get_domains_competitors_best_pages**<br>
    - Retrieves the best-performing pages of competitors for a given domain.<br>
    - Inputs:<br>
        - `input` (string): Requested url or domain.<br>
        - `competitors` (string[]): List of competitors to compare the input to.<br>

  - **get_domains_competitors_keywords_best_positions**<br>
    - Retrieves the best-ranking keywords for a given domain compared to its competitors.<br>
    - Inputs:<br>
        - `competitors` (string[]): List of competitor domains or root domains.<br>
        - `keywords` (string[]): List of keywords to look for.<br>

  - **get_domains_visibility_trends**<br>
    - Retrieves the visibility trend for a specific domain over time, showing how its search engine visibility has evolved.<br>
    - Input:<br>
        - `input` (string[]): Array containing the requested urls or domains.<br>
      
  - **get_domains_expired**<br>
    - Retrieves the visibility trend for a specific domain over time, showing how its search engine visibility has evolved.<br>



## Configuration
1. Sign up for an [Haloscan account](https://tool.haloscan.com/sign-up).
2. Choose a plan.
3. Generate your API key [from Configuration API page](https://tool.haloscan.com/user/api).
4. Use the API key for the Haloscan server in the Claude Desktop configuration file.

## Usage with Claude Desktop

Add this server to your Claude Desktop configuration file `claude_desktop_config.json`:

### NPX
```bash
{
  "mcpServers": {
    "haloscan": {
      "command": "npx",
      "args": [
        "-y",
        "@occirank/haloscan-server",
        "start"
      ],
      "env": {
        "HALOSCAN_API_KEY": "YOUR API KEY"
      }
    }
  }
}
```

### License
MIT
