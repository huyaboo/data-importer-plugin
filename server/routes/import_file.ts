import { schema, TypeOf } from '@osd/config-schema';
import { extname } from 'path';
import { Readable } from 'stream';
import { IRouter } from '../../../../src/core/server';
import { configSchema } from '../../config';
import { IFileParser } from '../types';
import { decideClient } from '../util';

interface FileStream extends Readable {
  hapi: {
    filename: string;
  };
}

export function importFileRoute(
  router: IRouter,
  config: TypeOf<typeof configSchema>,
  fileParsers: Map<string, IFileParser>,
  dataSourceEnabled: boolean
) {
  router.post(
    {
      path: '/api/static_data_ingestion/import_file',
      validate: {
        params: schema.object({
          indexName: schema.string(),
          dataSource: schema.maybe(schema.string()),
        }),
        body: schema.object({
          file: schema.stream(),
        }),
      },
    },
    async (context, request, response) => {
      const client = decideClient(dataSourceEnabled, context, request.params.dataSource);

      const file = request.body.file as FileStream;
      const fileType = extname(file.hapi.filename).toLowerCase();

      if (!(config.enabledFileTypes as string[]).includes(fileType)) {
        return response.badRequest({
          body: {
            message: `File type ${fileType} is not supported or enabled`,
          },
        });
      }

      if (!(await fileParsers.get(fileType)?.validateFile(file))) {
        return response.badRequest({
          body: {
            message: `File is not valid`,
          },
        });
      }

      try {
        const message = await fileParsers.get(fileType)?.ingestFile(file, {
          indexName: request.params.indexName,
          client,
        });

        return response.ok({
          body: {
            message,
          },
        });
      } catch (e) {
        return response.internalError({
          body: {
            message: `Error ingesting file: ${e}`,
          },
        });
      }
    }
  );
}
