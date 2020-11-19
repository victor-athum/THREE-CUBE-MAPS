import { v4 as uuid } from 'uuid';

export default class PanoramaErrorModel {
  id = uuid();

  status = 'Panorama Error';

  message = 'Something Happened While Building Panorama';
}
