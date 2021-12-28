## Obsidian Cooklang Importer

A very experimental cooklang recipe importer that leverages "parse-ingredient" and "recipe-scraper" to parse and convert recipes to cooklang.

The plugin currently registers a single command "Import Recipe URL as Cooklang". The command takes a URL and returns a new .cook file with the parsed results.

See https://github.com/nothingislost/Recipe-Scraper#supported-websites for a list of supported recipe websites.

### Installing via BRAT

Install the BRAT plugin via the Obsidian Plugin Browser and then add the beta repository "nothingislost/obsidian-cooklang-importer"

### Manually installing the plugin

- Copy over `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-cooklang-importer/`.
