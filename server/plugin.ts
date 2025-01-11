import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';
import { first } from 'rxjs/operators';
import { TypeOf } from '@osd/config-schema';
import { configSchema } from '../config';

import {
  IFileParser,
  StaticDataIngestionPluginSetup,
  StaticDataIngestionPluginStart,
} from './types';
import { importFileRoute } from './routes/import_file';
import { CSVParser } from './parsers/csv_parser';
import { DataSourcePluginSetup } from 'src/plugins/data_source/public';
import { importTextRoute } from './routes/import_text';
import { CSV_FILE_TYPE } from '../common/constants';

export interface StaticDataIngestionPluginSetupDeps {
  dataSource?: DataSourcePluginSetup;
}

export class StaticDataIngestionPlugin
  implements Plugin<StaticDataIngestionPluginSetup, StaticDataIngestionPluginStart> {
  private readonly logger: Logger;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup, { dataSource }: StaticDataIngestionPluginSetupDeps) {
    const config = await this.initializerContext.config
      .create<TypeOf<typeof configSchema>>()
      .pipe(first())
      .toPromise();

    const router = core.http.createRouter();

    // Register file parsers
    const fileParsers: Map<string, IFileParser> = new Map([[CSV_FILE_TYPE, new CSVParser()]]);

    // Register server side APIs
    importFileRoute(router, config, fileParsers, !!dataSource);
    importTextRoute(router, config, fileParsers, !!dataSource);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('staticDataIngestion: Started');
    return {};
  }

  public stop() {}
}
