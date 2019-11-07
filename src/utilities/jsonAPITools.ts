import { Deserializer } from 'jsonapi-serializer';
import { IJsonAPIQuery, SORT_DIRECTION } from '../typings';

export function jsonAPIQUeryParser(koaQuery: any): IJsonAPIQuery {

  const jsonAPIQuery = {
    page: {
      number: 1,
      size: 10,
    },
    sort: {
      field: undefined,
      direction: SORT_DIRECTION.ASC,
    },
    filters: {},
  };

  for (const key in koaQuery) {

    switch (key) {
      case 'page[number]':
        jsonAPIQuery.page.number = koaQuery[key];
        break;

      case 'page[size]':
        jsonAPIQuery.page.size = koaQuery[key];
        break;

      case 'sort':
        let sortField = koaQuery[key];
        let sortDirection = 'ASC';
        if (sortField.charAt(0) === '-') {
          sortDirection = 'DESC';
          sortField = sortField.substring(1);
        }

        jsonAPIQuery.sort.field = sortField;
        jsonAPIQuery.sort.direction = SORT_DIRECTION[sortDirection];
        break;

      default:
        break;
    }

    if (key.startsWith('filter[')) {
      const field = key.substring(
        key.lastIndexOf('[') + 1,
        key.lastIndexOf(']'),
      );

      if (field.length) {
        jsonAPIQuery.filters[field] = koaQuery[key];
      } else {
        jsonAPIQuery.filters = koaQuery[key];
      }

    }

  }

  return jsonAPIQuery;

}

export function paramsDeserializer(params: any) {
  const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
  return deserializer.deserialize(params);
}
