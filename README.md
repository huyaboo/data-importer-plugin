# Data Importer Plugin

An OpenSearch Dashboards plugin for importing your static data to OpenSearch indexes directly from Dashboards via text box or file upload. Multiple Data Source (MDS) compatible

Supported filetypes:

- JSON
- CSV
- NDJSON
- And more (TBD)

## Configurations

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

---

## Development

See the [OpenSearch Dashboards contributing
guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/CONTRIBUTING.md) for instructions
setting up your development environment.

    ## Scripts
    <dl>
      <dt><code>yarn osd bootstrap</code></dt>
      <dd>Execute this to install node_modules and setup the dependencies in your plugin and in OpenSearch Dashboards
      </dd>

      <dt><code>yarn plugin-helpers build</code></dt>
      <dd>Execute this to create a distributable version of this plugin that can be installed in OpenSearch Dashboards
      </dd>
    </dl>
