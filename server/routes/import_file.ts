import { schema, TypeOf } from '@osd/config-schema';
import { extname } from 'path';
import { Readable } from 'stream';
import { CSV_SUPPORTED_DELIMITERS } from '../../common/constants';
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
      options: {
        body: {
          maxBytes: config.maxFileSizeBytes,
          accepts: 'multipart/form-data',
          output: 'stream',
        },
      },
      validate: {
        query: schema.object({
          indexName: schema.string(),
          delimiter: schema.maybe(
            schema.string({
              validate(value: string) {
                if (!CSV_SUPPORTED_DELIMITERS.includes(value)) {
                  return `must be a supported delimiter`;
                }
              },
            })
          ),
          dataSource: schema.maybe(schema.string()),
        }),
        body: schema.object({
          file: schema.stream(),
        }),
      },
    },
    async (context, request, response) => {
      const client = decideClient(dataSourceEnabled, context, request.query.dataSource);

      const file = request.body.file as FileStream;
      const fileExtension = extname(file.hapi.filename).toLowerCase();
      const fileType = fileExtension.startsWith('.') ? fileExtension.slice(1) : fileExtension;

      if (!(config.enabledFileTypes as string[]).includes(fileType)) {
        return response.badRequest({
          body: {
            message: `File type ${fileType} is not supported or enabled`,
          },
        });
      }

      try {
        const message = await fileParsers.get(fileType)?.ingestFile(file, {
          indexName: request.query.indexName,
          client,
          delimiter: request.query.delimiter,
          dataSourceId: request.query.dataSource,
        });

        return response.ok({
          body: {
            message,
            success: true,
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
