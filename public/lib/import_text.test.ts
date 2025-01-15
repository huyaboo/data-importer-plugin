import { SupportedFileTypes } from 'common/types';
import { httpServiceMock } from '../../../../src/core/public/mocks';
import { importText } from './import_text';

interface ImportTextTestCaseFormat {
  text: string;
  textFormat: SupportedFileTypes;
  indexName: string;
  delimiter?: string;
  selectedDataSourceId?: string;
}

describe('importText()', () => {
  const httpMock = httpServiceMock.createStartContract();
  // @ts-ignore
  httpMock.post.mockImplementation((_, { query }: HttpFetchOptions) => {
    return Promise.resolve({
      success: true,
      message: {
        total: 5,
        message: `Indexed 5 documents into ${query?.indexName}`,
      },
    });
  });

  beforeEach(() => {
    httpMock.post.mockClear();
  });

  it.each<ImportTextTestCaseFormat>([
    {
      text: `{"foo":"bar"}\n{"baz":"qux"}`,
      textFormat: 'ndjson',
      indexName: 'test-ndjson',
      delimiter: undefined,
      selectedDataSourceId: undefined,
    },
    {
      text: `{"Product ID":7631,"SKU":"HEH-9133","Name":"On Cloud Nine Pillow","Product URL":"https://www.domain.com/product/heh-9133","Price":24.99,"Retail Price":24.99,"Thumbnail URL":"https://www.domain.com/images/heh-9133_600x600.png","Search Keywords":"lorem, ipsum, dolor, ...","Description":"Sociosqu facilisis duis ...","Category":"Home>Home Decor>Pillows|Back In Stock","Category ID":"298|511","Brand":"FabDecor","Child SKU":"","Child Price":"","Color":"White","Color Family":"White","Color Swatches":"","Size":"","Shoe Size":"","Pants Size":"","Occassion":"","Season":"","Badges":"","Rating Avg":4.2,"Rating Count":8,"Inventory Count":21,"Date Created":"2018-03-03 17:41:13"}\n{"Product ID":7615,"SKU":"HEH-2245","Name":"Simply Sweet Blouse","Product URL":"https://www.domain.com/product/heh-2245","Price":42,"Retail Price":59.95,"Thumbnail URL":"https://www.domain.com/images/heh-2245_600x600.png","Search Keywords":"lorem, ipsum, dolor, ...","Description":"Sociosqu facilisis duis ...","Category":"Clothing>Tops>Blouses|Clearance|Tops On Sale","Category ID":"285|512|604","Brand":"Entity Apparel","Child SKU":"HEH-2245-RSWD-SM|HEH-2245-RSWD-MD|HEH-2245-THGR-SM|EH-2245-THGR-MD|HEH-2245-DKCH-SM|HEH-2245-DKCH-MD","Child Price":"42|59.99","Color":"Rosewood|Thyme Green|Dark Charcoal","Color Family":"Red|Green|Grey","Color Swatches":"[{\"color\":\"Rosewood\", \"family\":\"Red\", \"swatch_hex\":\"#65000b\", \"thumbnail\":\"/images/heh-2245-rswd-sm_600x600.png\", \"price\":42}, {\"color\":\"Thyme Green\", \"family\":\"Green\", \"swatch_img\":\"/swatches/thyme_green.png\", \"thumbnail\":\"/images/heh-2245-thgr-sm_600x600.png\", \"price\":59.99}, {\"color\":\"Dark Charcoal\", \"family\":\"Grey\", \"swatch_hex\":\"#36454f\", \"thumbnail\":\"/images/heh-2245-dkch-sm_600x600.png\", \"price\":59.99}]","Size":"Small|Medium","Shoe Size":"","Pants Size":"","Occassion":"","Season":"Summer|Spring","Badges":"Exclusive|Clearance","Rating Avg":4.5,"Rating Count":10,"Inventory Count":8,"Date Created":"2018-03-20 22:24:21"}`,
      textFormat: 'ndjson',
      indexName: 'mds-ndjson',
      delimiter: undefined,
      selectedDataSourceId: 'datasource-ndjson',
    },
    {
      text: `field1;field2;field3\n111;Test CSV;"I am awesome"\n852;`,
      textFormat: 'csv',
      indexName: 'test-csv',
      delimiter: ';',
      selectedDataSourceId: undefined,
    },
    {
      text: `field1|field2|field3|field4\nMary Jane,26,TX,\nJohn Smith,22,WA,john@example.com`,
      textFormat: 'csv',
      indexName: 'mds-csv',
      delimiter: '|',
      selectedDataSourceId: 'datasource-csv',
    },
    {
      text: `{"name":"John", "age":30, "car":null}`,
      textFormat: 'json',
      indexName: 'test-json',
      delimiter: undefined,
      selectedDataSourceId: undefined,
    },
    {
      text: `{"name":"JohnDoe","age":30,"isStudent":false,"skills":["JavaScript","Python","HTML","CSS"],"address":{"street":"123ElmStreet","city":"Springfield","state":"IL","postalCode":"62704"},"hobbies":[{"name":"Photography","experience":"Intermediate"},{"name":"Hiking","experience":"Beginner"}]}`,
      textFormat: 'json',
      indexName: 'mds-json',
      delimiter: undefined,
      selectedDataSourceId: 'datasource-json',
    },
  ])(
    'should call /api/static_data_ingestion/_import_text with the correct args for a $textFormat file',
    async ({ text, textFormat, indexName, delimiter, selectedDataSourceId }) => {
      const response = await importText(
        httpMock,
        text,
        textFormat,
        indexName,
        delimiter,
        selectedDataSourceId
      );

      expect(response.success).toBe(true);
      expect(response.message.total).toBe(5);
      expect(httpMock.post).toBeCalledWith('/api/static_data_ingestion/_import_text', {
        query: {
          indexName,
          delimiter,
          fileType: textFormat,
          ...(selectedDataSourceId && { dataSource: selectedDataSourceId }),
        },
        body: JSON.stringify({ text }),
      });
    }
  );
});
