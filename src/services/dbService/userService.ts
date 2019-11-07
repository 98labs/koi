import { BaseDbService } from './baseDbService';

import { User } from './../../models/core';

export class UserService extends BaseDbService {

  protected _primaryKeyAttribute = 'partyId';
  protected _defaultSearchField = 'name';

  constructor() {
    super(User);
  }

}
