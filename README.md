# Data Importer Plugin

An OpenSearch Dashboards plugin for importing your static data to OpenSearch indexes directly from Dashboards via text box or file upload. Multiple Data Source (MDS) compatible.

https://github.com/user-attachments/assets/2eb590cb-a21a-4c4e-8b3f-5517365ffde5

Supported filetypes:

- JSON
- CSV
- NDJSON
- And more (TBD)

---

## Configurations

This plugin can be configured in your `config/opensearch_dashboards.yml`

```yaml
# Enable the plugin
data_importer_plugin.enabled: true

# Configure which file types will be supported (by default, all 3 are enabled)
data_importer_plugin.enabledFileTypes: ['csv', 'json', 'ndjson']

# Configure file size upload limit in bytes
data_importer_plugin.maxFileSizeBytes: 100000000

# Configure character limit for text data
data_importer_plugin.maxTextCount: 10000
```

## Pre-requisites
To function, this plugin requires OpenSearch Dashboards to be installed and configured. See the [OpenSearch Dashboards contributing
guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/CONTRIBUTING.md) for instructions
setting up your development environment.

## Development

Place this repo inside your `OpenSearch-Dashboards/plugins` directory.

From the OpenSearch-Dashboards project root, run the following commands:
```bash
cd plugins/data-importer-plugin

yarn osd bootstrap

yarn osd start --no-base-path
```

## Building

From the OpenSearch-Dashboards project root, run the following commands:
```bash
cd plugins/data-importer-plugin

yarn plugin-helpers build
```
