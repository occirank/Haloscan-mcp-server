# Haloscan MCP Server

[![npm](https://img.shields.io/npm/v/@occirank/haloscan-server?logo=npm)](https://www.npmjs.com/package/@occirank/haloscan-server)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-compatible-5A67D8)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

An MCP server that gives AI assistants and automation workflows access to the [Haloscan SEO API](https://www.haloscan.com/): keyword research, SERP history, domain intelligence, competitor analysis, expired domains, local SEO data, and rank-tracking projects.

## Requirements

- Node.js 16 or newer
- A [Haloscan account](https://tool.haloscan.com/sign-up)
- An API key from the [Haloscan API configuration page](https://tool.haloscan.com/user/api)

## Quick start

Add this entry to your MCP client configuration. In Claude Desktop, the file is named `claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "haloscan": {
      "command": "npx",
      "args": ["-y", "@occirank/haloscan-server", "start"],
      "env": {
        "HALOSCAN_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

Restart the MCP client after saving the configuration.

> [!IMPORTANT]
> Keep `HALOSCAN_API_KEY` private. Do not commit it or include it in prompts and logs.

## Parameter conventions

- A parameter without `?` is required. A parameter ending in `?` is optional.
- Dates use `YYYY-MM-DD` unless stated otherwise.
- `mode` generally accepts `auto`, `root`, `domain`, or `url`. Use `root` for an entire root domain.
- `_min` and `_max` parameters are inclusive lower and upper filters.
- Compact notation such as `volume_min/max` means the two separate parameters `volume_min` and `volume_max`.
- `_keep_na` retains results for which the filtered metric is unavailable.
- Defaults shown below come from the server's current validation schemas.

### Shared keyword-result filters

Tools marked **Keyword filters** accept all of these optional parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `lineCount` | `number` | Maximum result count. |
| `order_by` | `string` | Field used to sort results. |
| `order` | `string` | Sort direction, normally `asc` or `desc`. |
| `volume_min`, `volume_max` | `number` | Search-volume range. |
| `cpc_min`, `cpc_max` | `number` | CPC range. |
| `competition_min`, `competition_max` | `number` | Advertising-competition range. |
| `kgr_min`, `kgr_max` | `number` | Keyword Golden Ratio range. |
| `kvi_min`, `kvi_max` | `number` | Keyword Visibility Index range. |
| `kvi_keep_na` | `boolean` | Keep results without a KVI value. |
| `allintitle_min`, `allintitle_max` | `number` | `allintitle` result-count range. |
| `word_count_min`, `word_count_max` | `number` | Keyword word-count range. |
| `include`, `exclude` | `string` | Include or exclude matching keywords. |

### Shared domain-keyword filters

Tools marked **Domain filters** accept all of these optional parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `mode` | `string` | Input interpretation mode. |
| `lineCount` | `number` | Maximum result count. |
| `order_by` | `string` | Field used to sort results. |
| `order` | `string` | Sort direction. |
| `volume_min`, `volume_max` | `number` | Search-volume range. |
| `cpc_min`, `cpc_max` | `number` | CPC range. |
| `competition_min`, `competition_max` | `number` | Advertising-competition range. |
| `kgr_min`, `kgr_max` | `number` | Keyword Golden Ratio range. |
| `kvi_min`, `kvi_max` | `number` | Keyword Visibility Index range. |
| `kvi_keep_na` | `boolean` | Keep results without a KVI value. |
| `allintitle_min`, `allintitle_max` | `number` | `allintitle` result-count range. |

## Tool reference

### User

#### `get_user_credit`

Returns the credits available to the configured API key.

**Parameters:** none.

### Keyword Explorer

#### `get_keywords_overview`

Returns selected datasets for one keyword.

| Parameter | Type | Required | Default / values |
| --- | --- | :---: | --- |
| `keyword` | `string` | Yes | — |
| `requested_data` | `string[]` | No | Default: all supported datasets. Values: `keyword_match`, `related_search`, `related_question`, `similar_category`, `similar_serp`, `top_sites`, `similar_highlight`, `categories`, `synonyms`, `metrics`, `volume_history`, `serp`. |
| `lang` | `string` | No | Language selector. |

#### `get_keywords_match`

Finds expressions containing the seed keyword.

**Parameters:** `keyword: string`; `exact_match?: boolean`; plus all **Keyword filters**.

#### `get_keywords_similar`

Finds keywords with similar organic SERPs.

**Parameters:** `keyword: string`; `similarity_min?: number`; `similarity_max?: number`; `score_min?: number`; `score_max?: number`; `p1_score_min?: number`; `p1_score_max?: number`; plus all **Keyword filters**.

#### `get_keywords_highlights`

Finds expressions for which similar terms are highlighted in the SERP.

**Parameters:** `keyword: string`; `exact_match?: boolean`; `similarity_min?: number`; `similarity_max?: number`; plus all **Keyword filters**.

#### `get_keywords_related`

Returns expressions found in related searches.

**Parameters:** `keyword: string`; `exact_match?: boolean`; `depth_min?: number`; `depth_max?: number`; plus all **Keyword filters**.

#### `get_keywords_questions`

Returns relevant questions from People Also Ask and related searches.

**Parameters:** `keyword: string`; `exact_match?: boolean`; `question_types?: string[]`; `keep_only_paa?: boolean`; `depth_min?: number`; `depth_max?: number`; plus all **Keyword filters**.

#### `get_keywords_synonyms`

Returns synonyms for a seed keyword.

**Parameters:** `keyword: string`; `exact_match?: boolean`; plus all **Keyword filters**.

#### `get_keywords_find`

Combines multiple keyword-discovery sources in one request.

**Parameters:** `keyword?: string`; `keywords?: string[]`; `keywords_sources?: string[]` (`match`, `serp`, `related`, `highlights`, `questions`); `keep_seed?: boolean`; `exact_match?: boolean`; plus all **Keyword filters**. Supply `keyword` or `keywords`, and at least one source.

#### `get_keywords_site_structure`

Clusters supplied or discovered keywords.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `keyword` | `string` | No | Seed keyword; used for discovery when `keywords` is absent. |
| `keywords` | `string[]` | No | Keywords to cluster. |
| `exact_match` | `boolean` | No | Use exact-match discovery. |
| `neighbours_sources` | `string[]` | No | Sources used to find neighboring keywords. |
| `multipartite_modes` | `string[]` | No | Multipartite clustering modes. |
| `neighbours_sample_max_size` | `number` | No | Maximum neighbor sample size. |
| `mode` | `string` | No | Clustering mode, such as `manual` or `multi`. |
| `granularity` | `number` | No | Cluster granularity. |
| `manual_common_10` | `number` | No | Manual-mode common-results threshold in the top 10. |
| `manual_common_100` | `number` | No | Manual-mode common-results threshold in the top 100. |

#### `get_keywords_top_sites`

Returns the strongest sites across a supplied keyword set.

**Required:** `keywords: string[]`.

**Optional:** `mode: "auto" | "root" | "domain" | "url" = "auto"`; `order_by = "score"` (`site`, `score`, `unique_keywords`, `traffic`, `topical_relevance`, `top_3_positions`, `top_10_positions`, `top_50_positions`, `top_100_positions`, `total_traffic`, `total_keyword_count`); `order: "asc" | "desc" = "asc"`; and numeric ranges `unique_keywords_min/max`, `traffic_min/max`, `top_3_positions_min/max`, `top_10_positions_min/max`, `top_50_positions_min/max`, `top_100_positions_max`, `total_keyword_count_min/max`, `total_traffic_min/max`. The implemented type of `top_100_positions_min` is `boolean`.

#### `get_keywords_serp_compare`

Compares a keyword's SERP at two points in time.

**Parameters:** `keyword: string`; `period: string`; `first_date?: string`; `second_date?: string`. The date fields are used for a custom period.

#### `get_keywords_serp_availableDates`

Returns dates for which historical SERP data exists.

**Parameters:** `keyword: string`.

#### `get_keywords_serp_history`

Returns aggregated historical SERP presence for a keyword.

**Core parameters:** `keyword: string`; `lineCount?: number = 20`; `mode?: "auto" | "root" | "domain" | "url" = "auto"`; `date_from?: string`; `date_to?: string`; `page?: number = 1`; `order?: "asc" | "desc" = "asc"`; `status?: "both" | "active" | "lost"`; `available?: boolean`.

**`order_by` values (default `default`):** `default`, `times_seen`, `presence_rate`, `times_in_top_3`, `times_in_top_10`, `times_in_top_50`, `average_position`, `median_position`, `best_position`, `worst_position`, `first_time_seen`, `last_time_seen`, `first_position`, `last_position`, `current_position`, `unique_position_count`, `average_position_count`, `pages_seen`, `unique_pages`, `domains_seen`, `unique_domains`, `root_domain`, `available`, `first_page_seen`, `last_page_seen`, `most_seen_page`, `first_domain_seen`, `last_domain_seen`, `most_seen_domain`.

**Optional filters:** `times_seen_min/max: number`; `presence_rate_min/max: number`; `times_in_top_3_min/max: number` (0–1); `times_in_top_10_min/max: number`; `times_in_top_50_min/max: number`; `average_position_max: number`; `median_position_min/max: number`; `best_position_min/max: number`; `worst_position_min/max: number`; `first_position_min/max: number`; `last_position_min/max: number`; `first_time_seen_min/max: string`; `last_time_seen_min/max: string`; `current_position_min/max: number`; `current_position_keep_na?: boolean`; `unique_position_count_min/max: number`; `average_position_count_min/max: number`; `pages_seen_min/max: number`; `domains_seen_min/max: number`. The implemented type of `average_position_min` is `boolean`.

#### `get_keywords_serp_pageEvolution`

Tracks one URL's position for a keyword between two dates.

**Parameters:** `keyword: string`; `first_date: string`; `second_date: string`; `url: string`.

#### `get_keywords_serp_domain_evolution`

Tracks a domain's position for a keyword between two dates.

**Parameters:** `keyword: string`; `first_date: string`; `second_date: string`; `url: string` (domain or root domain); `mode?: "auto" | "root" | "domain" | "url" = "auto"`.

#### `get_keywords_bulk`

Returns keyword metrics in bulk.

**Parameters:** `keywords: string[]`; `exact_match?: boolean`; plus all **Keyword filters**.

#### `get_keywords_scrap`

Requests fresh SERP scraping. Processing can take about 24 hours.

**Parameters:** `keywords: string[]`.

### Site Explorer

#### `get_domains_overview`

Returns selected overview datasets for a site.

| Parameter | Type | Required | Default / values |
| --- | --- | :---: | --- |
| `input` | `string` | Yes | URL or domain. |
| `mode` | `string` | No | Input interpretation mode. |
| `requested_data` | `string[]` | No | Default: all. Values: `metrics`, `positions_breakdown`, `traffic_value`, `categories`, `best_keywords`, `best_pages`, `gmb_backlinks`, `visibility_index_history`, `positions_breakdown_history`, `positions_and_pages_history`. |
| `lang` | `string` | No | Language selector. |

#### `get_domains_positions`

Returns keywords and positions for a site.

**Parameters:** `input: string`; plus all **Domain filters**; `traffic_min/max?: number`; `position_min/max?: number`; `keyword_word_count_min/max?: number`; `serp_date_min/max?: string`; `keyword_include/exclude?: string`; `title_include/exclude?: string`.

#### `get_domains_top_pages`

Returns a site's top-performing pages.

**Parameters:** `input: string`; `mode?: string`; `lineCount?: number`; `order_by?: string`; `order?: string`; and numeric ranges `known_versions_min/max`, `total_traffic_min/max`, `unique_keywords_min/max`, `total_top_3_min/max`, `total_top_10_min/max`, `total_top_50_min/max`, `total_top_100_min/max`.

#### `get_domains_aio_sources`

Returns AI Overview source appearances for a URL or domain.

**Core parameters:** `input: string`; `mode?: "auto" | "root" | "domain" | "url" = "auto"`; `lineCount?: number = 20`; `page?: number = 1`; `order?: "asc" | "desc" = "asc"`; `order_by?: string = "default"` (`default`, `keyword`, `volume`, `position`, `url`, `cpc`, `competition`, `kgr`, `allintitle`, `last_scrap`, `word_count`, `result_count`).

**Optional filters:** numeric ranges `volume_min/max`, `cpc_min/max`, `competition_min/max`, `kgr_min/max`, `kvi_min/max`, `allintitle_min/max`, `traffic_min/max`, `position_min/max`, `keyword_word_count_min/max`; `kvi_keep_na?: boolean`; `serp_date_min/max?: string`; `keyword_include/exclude?: string`; `title_include/exclude?: string`; `url_include/exclude?: string`; `redirects?: boolean`; `spell_suggests?: boolean`; `spell_both?: boolean`; `search_intent_includes/excludes?: ("informational" | "transactional" | "commercial" | "navigational" | "local" | "brand")[]`; `serp_features_includes/excludes?: string[]`.

#### `get_domains_history_positions`

Returns historical keyword positions between two dates.

**Required:** `input: string`; `date_from: string`; `date_to: string`.

**Optional:** all **Domain filters**; numeric ranges `word_count_min/max`, `best_position_min/max`, `worst_position_min/max`, `most_recent_position_min/max`, `subdomain_count_min/max`, `page_count_min/max`; date ranges `first_time_seen_min/max`, `last_time_seen_min/max`; `still_there?: boolean`; `keyword_include/exclude?: string`. Volume, CPC, competition, KGR, KVI, and allintitle ranges are also accepted through the shared filters.

#### `get_domains_history_pages`

Returns historical page-level performance between two dates.

**Required:** `input: string`; `date_from: string`; `date_to: string`.

**Optional:** `mode?: string`; `lineCount?: number`; `order_by?: string`; `order?: string`; and numeric ranges `known_versions_min/max`, `total_traffic_min/max`, `unique_keywords_min/max`, `total_top_3_min/max`, `total_top_10_min/max`, `total_top_50_min/max`, `total_top_100_min/max`.

#### `get_page_best_keywords`

Returns the best keywords for one or more pages.

**Parameters:** `input: string[]`; `lineCount?: number`; `strategy?: number`. Note that the current server schema expects a number for `strategy`.

#### `get_domains_keywords`

Checks current positions for a supplied domain and keyword list.

**Parameters:** `input: string`; `keywords: string[]`; plus all **Domain filters**; `position_min/max?: number`; `traffic_min/max?: number`; `title_word_count_min/max?: number`; `serp_date_min/max?: string`; `keyword_include/exclude?: string`; `title_include/exclude?: string`.

#### `get_domains_bulk`

Returns domain metrics in bulk.

**Parameters:** `inputs: string[]`; `mode?: string`; `lineCount?: number`; `order_by?: string`; `order?: string`; and numeric ranges `total_traffic_min/max`, `unique_keywords_min/max`, `total_top_3_min/max`, `total_top_10_min/max`, `total_top_50_min/max`, `total_top_100_min/max`.

#### `get_domains_competitors`

Finds organic competitors for a site.

**Parameters:** `input: string`; `mode?: string`; `lineCount?: number`; `page?: string`.

#### `get_domains_competitors_keywords_diff`

Compares a reference site with competitors at keyword level.

**Core parameters:** `input: string`; `competitors?: string[]`; `exclusive?: boolean`; `missing?: boolean`; `besting?: boolean`; `bested?: boolean`; `acceptedTypes?: string[]`; `page?: number`; plus all **Domain filters**.

**Optional filters:** `best_competitor_traffic_min/max?: number`; `best_competitor_traffic_keep_na?: boolean`; `best_reference_traffic_min/max?: number`; `best_reference_traffic_keep_na?: boolean`; `best_reference_position_min/max?: number`; `competitors_positions_min/max?: number`; `unique_competitors_count_min/max?: number`; `keyword_word_count_min/max?: number`; `keyword_include/exclude?: number`; `volume_keep_na?: boolean`; `cpc_keep_na?: boolean`; `competition_keep_na?: boolean`; `kgr_keep_na?: boolean`; `allintitle_keep_na?: boolean`; `google_indexed_min/max?: number`; `google_indexed_keep_na?: boolean`.

#### `get_domains_competitors_best_pages`

Returns the best-performing pages among supplied competitors.

**Parameters:** `input: string`; `competitors?: string[]`; `mode?: string`; `lineCount?: number`; `page?: string`; `order_by?: string`; numeric ranges `total_traffic_min/max`, `positions_min/max`, `keywords_min/max`, `exclusive_keywords_min/max`, `besting_keywords_min/max`, `bested_keywords_min/max`; `total_traffic_keep_na?: boolean`.

#### `get_domains_competitors_keywords_best_pos`

Returns the best competitor position for each supplied keyword.

**Required:** `competitors: string[]`; `keywords: string[]`.

**Optional:** all **Domain filters**; `best_competitor_traffic_min/max?: number`; `best_competitor_traffic_keep_na?: boolean`; `best_competitor_position_min/max?: number`; `competitors_positions_min/max?: number`; `unique_competitors_count_min/max?: number`; `keyword_word_count_min/max?: number`; `keyword_include/exclude?: number`; `volume_keep_na?: boolean`; `cpc_keep_na?: boolean`; `competition_keep_na?: boolean`; `kgr_keep_na?: boolean`; `kvi_keep_na?: boolean`; `allintitle_keep_na?: boolean`.

#### `get_domains_visibility_trends`

Returns visibility history for multiple sites.

**Parameters:** `input: string[]`; `mode?: string`; `type?: string` (`first`, `highest`, `trends`, or `index`; use `index` for raw visibility values).

#### `get_domains_expired`

Searches the expired-domain index.

**Core parameters:** `keyword?: string`; `lineCount?: number`; `page?: string`; `order_by?: string`; `order?: string`; `root_domain_include?: string`; `root_domain_exclude?: string`.

**Optional numeric ranges:** `total_pages_min/max`, `total_domains_min/max`, `referring_domains_min/max`, `total_keywords_min/max`, `total_traffic_min/max`, `total_top_100_positions_min/max`, `total_top_50_positions_min/max`, `total_top_10_positions_min/max`, `total_top_3_positions_min/max`, `total_top_100_traffic_min/max`, `total_top_50_traffic_min/max`, `total_top_10_traffic_min/max`, `total_top_3_traffic_min/max`, `matching_keywords_min/max`, `matching_pages_min/max`, `matching_traffic_min/max`, `matching_most_recent_position_min/max`, `matching_top_100_positions_min/max`, `matching_top_50_positions_min/max`, `matching_top_10_positions_min/max`, `matching_top_3_positions_min/max`, `matching_top_100_traffic_min/max`, `matching_top_50_traffic_min/max`, `matching_top_10_traffic_min/max`, `matching_top_3_traffic_min/max`, `matching_count_min/max`, `count_min/max`, `fb_comments_min/max`, `fb_shares_min/max`, `pinterest_pins_min/max`.

**Optional date ranges:** `first_time_available_min/max`, `last_time_available_min/max`, `firstseen_min`, `first_seen_max`, `last_seen_min/max`.

#### `get_domains_expired_reveal`

Reveals expired domains returned as protected keys.

**Parameters:** `root_domain_keys: number[]`.

#### `get_domains_gmb_backlinks`

Returns Google Business Profile backlink data.

**Parameters:** `input?: string`; `mode?: string`; `lineCount?: number`; `page?: number`; `order_by?: string` (`default`, `rating_count`, `rating_value`, `is_claimed`, `total_photos`, `name`, `address`, `phone`, `longitude`, `latitude`, `categories`, `url`, `domain`, `root_domain`); `order?: string`; numeric ranges `rating_count_min/max`, `rating_value_min/max`, `latitude_min/max`, `longitude_min/max`; `rating_count_keep_na?: boolean`; `rating_value_keep_na?: boolean`; `latitude_keep_na?: boolean`; `longitude_keep_na?: boolean`; `categories_include?: string`; `categories_exclude?: string`; `is_claimed?: boolean`.

#### `get_domains_gmb_backlinks_map`

Returns map data for Google Business Profile backlinks.

**Parameters:** `input: string`; `mode?: string`.

#### `get_domains_gmb_backlinks_categories`

Returns category data for Google Business Profile backlinks.

**Parameters:** `input: string`; `mode?: string`.

### Projects

| MCP tool | Method | API documentation |
| --- | :---: | --- |
| `create_project` | `POST` | [projects/create](https://tool.haloscan.com/user/api?endpoint=projects_create) |
| `update_project` | `POST` | [projects/update](https://tool.haloscan.com/user/api?endpoint=projects_update) |
| `delete_project` | `DELETE` | [projects/delete](https://tool.haloscan.com/user/api?endpoint=projects_delete) |
| `list_projects` | `GET` | [projects/list](https://tool.haloscan.com/user/api?endpoint=projects_list) |
| `get_project_details` | `POST` | [project details](https://tool.haloscan.com/user/api?endpoint=projects_details) |
| `get_projects_overview` | `POST` | [projects overview](https://tool.haloscan.com/user/api?endpoint=projects_overview) |
| `get_project_overview` | `POST` | [single-project overview](https://tool.haloscan.com/user/api?endpoint=projects_single_overview) |
| `get_project_keywords` | `POST` | [project keywords](https://tool.haloscan.com/user/api?endpoint=projects_keywords) |
| `get_project_tracking` | `POST` | [project tracking](https://tool.haloscan.com/user/api?endpoint=projects_tracking) |

#### `create_project`

Creates a project.

**Parameters:** `site: string`; `name: string`; `keywords?: string[]`; `tags?: { tag: string, keywords: string[] }[]`; `competitors?: string[]`.

#### `update_project`

Replaces the editable settings of an existing project.

**Parameters:** `project_id: string`; `site: string`; `name: string`; `keywords?: string[]`; `tags?: { tag: string, keywords: string[] }[]`; `competitors?: string[]`.

#### `delete_project`

Permanently deletes a project. This cannot be undone.

**Parameters:** `project_id: string`.

#### `list_projects`

Returns existing projects with their keywords and tags.

**Parameters:** none.

#### `get_project_details`

Returns all settings for one project.

**Parameters:** `project_id: string`.

#### `get_projects_overview`

Returns position graphs, visibility data, and keyword statistics across projects. Costs 1 site credit per call.

**Parameters:** `date_from?: string`; `date_to?: string`; `orderBy?: "custom_rank" | "creation_date" | "name" = "creation_date"`; `order?: "asc" | "desc" = "desc"`.

#### `get_project_overview`

Returns overview data and graphs for one project. Costs 1 site credit per call.

**Parameters:** `project_id: string`; `date_from?: string`; `date_to?: string`.

#### `get_project_keywords`

Returns a project's rank-tracking table. Costs 1 site credit per call plus 1 export/result credit for each returned result.

**Parameters:** `project_id: string`; `date_from?: string`; `date_to?: string`; `tags?: string[]`; `lineCount?: number = 20`; `page?: number = 1`.

#### `get_project_tracking`

Returns ranking-evolution and new/lost-keyword graph data. Costs 1 site credit per call.

**Parameters:** `project_id: string`; `date_from?: string`; `date_to?: string`; `tags?: string[]`.

## Example prompts

- “Find related questions for `technical SEO`, only keeping keywords with at least 100 searches.”
- “Show the top pages for `example.com`, sorted by total traffic.”
- “Compare lost keyword positions for `example.com` between 2026-01-01 and 2026-06-30.”
- “Find keyword gaps between `example.com` and these three competitors.”
- “List my projects, then show tracking data for the project tagged `commercial`.”

## Troubleshooting

If the server cannot find the API key, confirm that `HALOSCAN_API_KEY` is inside the MCP server's `env` object and restart the client.

If the server does not start, verify the runtime:

```bash
node --version
npx --version
```

Some Haloscan endpoints consume site or export credits. Use `get_user_credit` before large requests or exports.

## License

MIT
