import { decideClient } from './util';
import { coreMock } from '../../../../src/core/server/mocks';

describe('decideClient()', () => {
  const mockContext = {
    core: coreMock.createRequestHandlerContext(),
    dataSource: {
      opensearch: {
        getClient: jest.fn().mockReturnValue({}),
      },
    },
  };

  beforeEach(() => {
    mockContext.dataSource.opensearch.getClient.mockClear();
  });

  it('should return MDS client', async () => {
    const dataSourceEnabled = true;
    const dataSourceId = 'foo';
    const client = await decideClient(dataSourceEnabled, mockContext, dataSourceId);
    expect(mockContext.dataSource.opensearch.getClient).toBeCalledWith(dataSourceId);
    expect(client).toMatchObject({});
  });

  it.each([
    {
      dataSourceEnabled: false,
      dataSourceId: undefined,
    },
    {
      dataSourceEnabled: true,
      dataSourceId: undefined,
    },
    {
      dataSourceEnabled: false,
      dataSourceId: 'foo',
    },
  ])(
    'should return local cluster client when dataSourceEnabled is $dataSourceEnabled and dataSourceId is $dataSourceId',
    async ({ dataSourceEnabled, dataSourceId }) => {
      const client = await decideClient(dataSourceEnabled, mockContext, dataSourceId);
      expect(client).toMatchObject(mockContext.core.opensearch.client.asCurrentUser);
    }
  );
});
