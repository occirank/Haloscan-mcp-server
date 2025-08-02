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
        - `requested_data` (string[]): Any combination of [keyword_match, related_search, related_question, similar_category, similar_serp, top_sites, similar_highlight, categories, metrics, volume_history, serp ].<br>
        It is mandatory to specify at least one of the requested data. Here is what they mean:<br>
          - `keyword_match`: Top 10 (wrt search volume) keywords that include the provided keyword in their search query (exact match).<br>
          - `related_search`: Top 10 (wrt search volume) keywords that appear in SERP's "Related Searches" section for the provided keyword.<br>
          - `related_question`: Top 10 (wrt search volume) keywords that appear in SERP's "People Also Ask" (or in "Related Searches if the keyword is obviously a question) section for the provided keyword.<br>
          - `similar_category`: Top 10 (wrt search volume) keywords that have the same "Products & Services" category tree as the provided keyword. Careful, fetching this data significantly increases response time.<br>
          - `similar_serp`: Top 10 (wrt SERP similarity) keywords that have a similar organic SERP as the provided keyword.<br>
          - `top_sites`: Top 10 (wrt visibility) websites that rank for the provided keyword and similar ones.<br>
          - `similar_highlight`: Top 10 (wrt search volume) keywords for which similar terms are highlighted in SERP result pages.<br>
          - `categories`: List of Products & Services categories the provided keyword belongs to.<br>
          - `metrics`: List of metrics for the provided keyword. Those metrics include:<br>
            - Ads metrics: volume, competition, CPC. Your usual ads data.<br>
            - SEO metrics: corrected search volume, keyword match count, allintitle, KGR, KVI (Keyword Visibility Index).<br>
          - `volume_history`: Up to 2 years of search volume history for the provided keyword.<br>
          - `serp`: Last organic SERP for the provided keyword.<br>

  - **get_keywords_match**<br>
    - Retrieves keywords/expressions including the provided keyword as a substring.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_highlights**<br>
    - Retrieves keywords/expressions for which similar terms are highlighted in SERP result pages.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_related**<br>
    - Retrieves keywords/expressions that appear in SERP's "Related Searches" section for the provided keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_questions**<br>
    - Retrieves keywords/expressions that appear in SERP's "People Also Ask" (or in "Related Searches if the keyword is obviously a question) section for the provided keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_find**<br>
    - Retrieves comprehensive data for a given keyword OR list of keywords, including SEO metrics & ads metrics. This endpoint is a wrapper to call `get_keywords_match`, `get_keywords_related`, `get_keywords_questions`, `get_keywords_highlights` together.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword.<br>
        - `keywords` (string[]): Requested keywords. Ignored if `keyword` is provided.<br>
        - `keywords_sources` (string[]): Which strategies to use to find keywords from input (Any combination of [match, serp, related, highlights, questions]).<br>
        At least one is required. Here is what they mean:<br>
          - `match`: Keywords/expressions that include the provided keyword in their search query (exact match).<br>
          - `serp`: Keywords/expressions that have a similar organic SERP as the provided keyword.<br>
          - `related`: Keywords/expressions that appear in SERP's "Related Searches" section for the provided keyword.<br>
          - `highlights`: Keywords/expressions for which similar terms are highlighted in SERP result pages.<br>
          - `questions`: Keywords/expressions that appear in SERP's "People Also Ask" (or in "Related Searches if the keyword is obviously a question) section for the provided keyword.<br>

  - **get_keywords_site_structure**<br>
    - Clustering endpoint. You can use it either in bulk (then provide a value for `keywords`) or in single request (then provide a value for `keyword`).<br>
    - Input:<br>
        - `keyword` (string): Requested keyword. Ignored if `keywords` is provided. If you only provide a value for `keyword` (without `keywords`), then an equivalent of `get_keywords_find` will run first, to fetch keywords to group.<br>
        - `keywords` (string[]): Requested keywords.<br>
        - `mode` (string): Clustering mode. Either `manual` or `multi`. In `manual` mode, keywords are grouped based on SERP similarity. In `multi` mode, hierarchical groups are made, based on graph link density.<br>

  - **get_keywords_serp_compare**<br>
    - Compares a given keyword/expression's SERP at 2 different dates.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword/expression.<br>
        - `period` (string): The comparison period for SERPs (1 month, 3 months, 6 months, 12 months, custom).<br>
        - `first_date` (string): Date in YYYY-MM-DD format. Ignored if `period` is not `custom`. This date must be a valid date for the given keyword/expression. Valid search dates are returned in `available_search_dates` item in call response, or as a response for `get_keywords_serp_available_dates`.<br>
        - `second_date` (string): Date in YYYY-MM-DD format. Ignored if `period` is not `custom`. This date must be a valid date for the given keyword/expression. Valid search dates are returned in `available_search_dates` item in call response, or as a response for `get_keywords_serp_available_dates`.<br>

  - **get_keywords_serp_availableDates**<br>
    - Retrieves the available dates for historical SERP data for a given keyword.<br>
    - Input:<br>
        - `keyword` (string): Requested keyword.<br>

  - **get_keywords_serp_pageEvolution**<br>
    - Retrieves the evolution of SERP rankings of a given URL for a specific keyword over time. All parameters are mandatory.<br>
    - Inputs:<br>
        - `keyword` (string): Requested keyword/expression.<br>
        - `first_date` (string): Date in YYYY-MM-DD format.<br>
        - `second_date` (string): Date in YYYY-MM-DD format.<br>
        - `url` (string): URL to track rankings for.<br>

  - **get_keywords_bulk**<br>
    - Retrieves keyword data (SEO metrics, ads metrics, etc.) for multiple keywords at once in a bulk request.<br>
    - Input:<br>
        - `keywords` (string[]): Array containing the requested keywords.<br>

  - **get_keywords_scrap**<br>
    - Ask Haloscan to scrape the search engine results pages (SERP) for a given keyword/expression. The scrap will take around 24h to be completed.<br>
    - Input:<br>
        - `keywords` (string[]): Array containing the requested keywords.<br>

#### 3. Site Explorer Tools
  - **get_domains_overview**<br>
    - Retrieves a comprehensive SEO performance summary for a specific domain.<br>
    - Inputs:<br>
        - `input` (string): Target url, domain or root domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `requested_data` (string[]): At least one of (`metrics`, `positions_breakdown`, `traffic_value`, `categories`, `best_keywords`, `best_pages`, `gmb_backlinks`, `visibility_index_history`, `positions_breakdown_history`, `positions_and_pages_history`). Which data to fetch among:<br>
          - `metrics`: SEO metrics for the given domain (VI, position count, keyword count, traffic, page count, ranks, etc.).<br>
          - `positions_breakdown`: Search engine ranking positions for the given domain.<br>
          - `traffic_value`: Traffic value for the given domain (may take a while to compute for large domains).<br>
          - `categories`: Categories for the given domain (may take a while to compute for large domains).<br>
          - `best_keywords`: Top-performing keywords for the given domain (may take a while to compute for large domains).<br>
          - `best_pages`: Top-performing pages for the given domain (may take a while to compute for large domains).<br>
          - `gmb_backlinks`: GMB backlinks for the given domain.<br>
          - `visibility_index_history`: Visibility index history for the given domain.<br>
          - `positions_breakdown_history`: Search engine ranking positions breakdown history for the given domain.<br>
          - `positions_and_pages_history`: Search engine ranking positions and pages history for the given domain.<br>

  - **get_domains_positions**<br>
    - Retrieves the search engine ranking positions of a specified domain.<br>
    - Input:<br>
        - `input` (string): Target url, domain or root domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>

  - **get_domains_top_pages**<br>
    - Retrieves the top-performing pages of a specified domain based on aggregated organic search metrics such as traffic, number of ranking keywords.<br>
    - Input:<br>
        - `input` (string): Target url, domain or root domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>

  - **get_domains_history_positions**<br>
    - Retrieves historical ranking positions for a specific domain, between 2 specified dates. Very useful if you want to find lost positions.<br>
    - Inputs:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `date_from` (string): Date in YYYY-MM-DD format.<br>
        - `date_to` (string): Date in YYYY-MM-DD format.<br>

  - **get_domains_history_pages**<br>
    - Retrieves page-wise historical SEO performance data for a specified domain between 2 specified dates.<br>
    - Inputs:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `date_from` (string): Date in YYYY-MM-DD format.<br>
        - `date_to` (string): Date in YYYY-MM-DD format.<br>

  - **get_page_best_keywords**<br>
    - Retrieves the top-performing keywords for a specific URL, showing which search queries drive the most traffic and visibility to that page.<br>
    - Input:<br>
        - `input` (string[]): Target urls.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `strategy` (string): Any of (`both`, `only_active`, `only_lost`). Whether to return all positioned keywords, only active ones or only lost ones.<br>

  - **get_domains_keywords**<br>
    - Retrieves current positions of a given domain for a list of given keywords.<br>
    - Inputs:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `keywords` (string[]): Mandatory array containing the requested keywords.<br>

  - **get_domains_bulk**<br>
    - Retrieves SEO performance metrics for multiple domains in a single request.<br>
    - Input:<br>
        - `inputs` (string[]): Array containing the requested urls or domains.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domains.<br>

  - **get_domains_competitors**<br>
    - Retrieves a list of organic search competitors for a given domain based on overlapping keywords (may take a while to compute for large domains).<br>
    - Input:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>

  - **get_domains_competitors_keywords_diff**<br>
    - Compares the keyword differences between a given domain and its competitors, highlighting keywords that one domain ranks for but the other does not (may take a while to compute for large domains).<br>
    - Inputs:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `competitors` (string[]): Mandatory list of (up to 20) competitors to compare the input to.<br>
        - `exclusive` (boolean): Whether to include positions where only the search input is positioned, and none of the requested competitors is.<br>
        - `missing` (boolean): Whether to include positions where the search input is not positioned, and at least one of the requested competitors is.<br>
        - `bested` (boolean): Whether to include positions where the search input is positioned, and better positioned than at least one of the requested competitors.<br>
        - `besting` (boolean): Whether to include positions where the search input is positioned, but at least one of the requested competitors is positioned better.<br>

  - **get_domains_competitors_best_pages**<br>
    - Retrieves the best-performing pages of (specified) competitors of a given domain (may take a while to compute for large domains).<br>
    - Inputs:<br>
        - `input` (string): Target url or domain.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `competitors` (string[]): Mandatory list of (up to 20) competitors to compare the input to.<br>

  - **get_domains_competitors_keywords_best_positions**<br>
    - Retrieves the best-ranking positions for a given list of domains on a given list of keywords.<br>
    - Inputs:<br>
        - `competitors` (string[]): List of competitor domains or root domains.<br>
        - `keywords` (string[]): Mandatory list of keywords to look for.<br>

  - **get_domains_visibility_trends**<br>
    - Retrieves the visibility trend for a specific domain over time, showing how its search engine visibility has evolved.<br>
    - Input:<br>
        - `input` (string[]): Array containing the requested urls or domains.<br>
        - `mode` (string): Any of (`auto`, `root`, `domain`, `url`). How to interpret the input. Usually, you want to use `root` to get data about the root domain.<br>
        - `type` (string): Any of (`first`, `highest`, `trends`, `index`). Should data be scaled, and how. Use `index` to get the raw visibility index.<br>

  - **get_domains_expired**<br>
    - Returns a list of available domains. Domains are returned without their url unless you have already revealed them (in which case root_domain is filled), and a call to domains/expired/reveal is required to reveal domains you are interested in.<br>
    - Input:<br>
        - `keyword` (string): Optional keyword on which the expired domain should have been positioned.<br>



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
