import { v4 as uuid } from 'uuid';

export default class HttpErrorResponseModel {
  id = uuid();

  status = '';

  message = '';

  url = '';

  raw = null;
}
