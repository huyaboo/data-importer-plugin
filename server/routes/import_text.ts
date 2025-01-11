import { schema, TypeOf } from '@osd/config-schema';
import { CSV_SUPPORTED_DELIMITERS } from '../../common/constants';
import { IRouter } from '../../../../src/core/server';
import { configSchema } from '../../config';
import { IFileParser } from '../types';
import { decideClient } from '../util';

export function importTextRoute(
  router: IRouter,
  config: TypeOf<typeof configSchema>,
  fileParsers: Map<string, IFileParser>,
  dataSourceEnabled: boolean
) {
  router.post(
    {
      path: '/api/static_data_ingestion/import_text',
      validate: {
        query: schema.object({
          fileType: schema.string({
            validate(value: string) {
              if (!(config.enabledFileTypes as string[]).includes(value)) {
                return `must be an enabled file type`;
              }
            },
          }),
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
          text: schema.string({ minLength: 1, maxLength: config.maxTextCount }),
        }),
      },
    },
    async (context, request, response) => {
      const client = decideClient(dataSourceEnabled, context, request.query.dataSource);

      let isValid;
      try {
        isValid = await fileParsers
          .get(request.query.fileType)
          ?.validateText(request.body.text, { delimiter: request.query.delimiter });
      } catch (e) {
        return response.badRequest({
          body: {
            message: `Text is not valid: ${e}`,
          },
        });
      }

      if (!isValid) {
        return response.badRequest({
          body: {
            message: 'Text is not valid',
          },
        });
      }

      try {
        const message = await fileParsers
          .get(request.query.fileType)
          ?.ingestText(request.body.text, {
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
            message: `Error ingesting text: ${e}`,
          },
        });
      }
    }
  );
}
