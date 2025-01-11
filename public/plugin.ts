import { i18n } from '@osd/i18n';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  Plugin,
  PluginInitializerContext,
} from '../../../src/core/public';
import {
  DataImporterPluginSetup,
  DataImporterPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME, PLUGIN_NAME_AS_TITLE } from '../common';
import { ConfigSchema } from '../config';

export class DataImporterPlugin
  implements Plugin<DataImporterPluginSetup, DataImporterPluginStart> {
  private readonly config: ConfigSchema;

  constructor(initializerContext: PluginInitializerContext<ConfigSchema>) {
    this.config = initializerContext.config.get();
  }

  public setup(core: CoreSetup): DataImporterPluginSetup {
    const config = this.config;
    // Register an application into the side navigation menu
    core.application.register({
      id: 'dataImporterPlugin',
      title: PLUGIN_NAME_AS_TITLE,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in opensearch_dashboards.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params, config);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('dataImporterPlugin.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): DataImporterPluginStart {
    return {};
  }

  public stop() {}
}
