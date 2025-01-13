import { OpenSearchClient, RequestHandlerContext } from 'opensearch-dashboards/server';

export const decideClient = async (
  dataSourceEnabled: boolean,
  context: RequestHandlerContext,
  dataSourceId?: string
): Promise<OpenSearchClient> => {
  return dataSourceEnabled && dataSourceId
    ? await context.dataSource.opensearch.getClient(dataSourceId)
    : context.core.opensearch.client.asCurrentUser;
};
