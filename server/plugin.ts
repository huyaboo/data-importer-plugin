import { first } from 'rxjs/operators';
import { TypeOf } from '@osd/config-schema';
import { DataSourcePluginSetup } from 'src/plugins/data_source/public';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';
import { configSchema } from '../config';

import { IFileParser, DataImporterPluginSetup, DataImporterPluginStart } from './types';
import { importFileRoute } from './routes/import_file';
import { CSVParser } from './parsers/csv_parser';
import { importTextRoute } from './routes/import_text';
import { CSV_FILE_TYPE } from '../common/constants';

export interface DataImporterPluginSetupDeps {
  dataSource?: DataSourcePluginSetup;
}

export class DataImporterPlugin
  implements Plugin<DataImporterPluginSetup, DataImporterPluginStart> {
  private readonly logger: Logger;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup, { dataSource }: DataImporterPluginSetupDeps) {
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
    this.logger.debug('dataImporterPlugin: Started');
    return {};
  }

  public stop() {}
}
