import { FileParserService } from 'server/parsers/file_parser_service';
import { OpenSearchClient, RequestHandlerContext } from '../../../../src/core/server';

export const decideClient = async (
  dataSourceEnabled: boolean,
  context: RequestHandlerContext,
  dataSourceId?: string
): Promise<OpenSearchClient> => {
  return dataSourceEnabled && dataSourceId
    ? // @ts-expect-error
      await context.dataSource.opensearch.getClient(dataSourceId)
    : context.core.opensearch.client.asCurrentUser;
};

export const validateEnabledFileTypes = (fileTypes: string[], fileParsers: FileParserService) => {
  const nonRegisteredFileTypes = fileTypes.filter(
    (fileType) => !fileParsers.hasFileParserBeenRegistered(fileType)
  );
  if (nonRegisteredFileTypes.length > 0) {
    throw new Error(
      `The following enabledFileTypes are not registered: ${nonRegisteredFileTypes.join(', ')}`
    );
  }
};
