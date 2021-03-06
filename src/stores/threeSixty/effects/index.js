import HttpErrorResponseModel from '../../../models/HttpErrorResponseModel';
import UrlModel from '../models/UrlModel';
import { CubeTest1, CubeTest2 } from '../../../TestCubes';
import CubeModel from '../models/CubeModel';

export default class ThreeSixtyEffect {
  static async getScenes(
    language,
    builderId,
    projectId,
    layoutName,
    level,
    style,
    mode
  ) {
    const url = new UrlModel(CubeTest2);
    const cube = new CubeModel(url);
    console.log('cube', cube);
    return cube;
  }
}
