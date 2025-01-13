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
