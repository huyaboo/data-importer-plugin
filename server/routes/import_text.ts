import { schema, TypeOf } from '@osd/config-schema';
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
        params: schema.object({
          fileType: schema.string({
            validate(value: string) {
              if ((config.enabledFileTypes as string[]).includes(value)) {
                return `must be an enabled file type`;
              }
            },
          }),
          indexName: schema.string(),
          dataSource: schema.maybe(schema.string()),
        }),
        body: schema.object({
          text: schema.string({ minLength: 1, maxLength: config.maxTextCount }),
        }),
      },
    },
    async (context, request, response) => {
      const client = decideClient(dataSourceEnabled, context, request.params.dataSource);

      if (!(await fileParsers.get(request.params.fileType)?.validateText(request.body.text!))) {
        return response.badRequest({
          body: {
            message: `Text is not valid`,
          },
        });
      }

      try {
        const message = await fileParsers
          .get(request.params.fileType)
          ?.ingestText(request.body.text, {
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
            message: `Error ingesting text: ${e}`,
          },
        });
      }
    }
  );
}
