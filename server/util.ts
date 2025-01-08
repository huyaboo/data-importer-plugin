import { OpenSearchClient, RequestHandlerContext } from 'opensearch-dashboards/server';

export const decideClient = (
  dataSourceEnabled: boolean,
  context: RequestHandlerContext,
  dataSourceId?: string
): OpenSearchClient => {
  return dataSourceEnabled && dataSourceId
    ? context.dataSource.opensearch.getClient(dataSourceId)
    : context.core.opensearch.client.asCurrentUser;
};
