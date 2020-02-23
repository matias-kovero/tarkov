import { Api } from "./api";
import { container, singleton } from "tsyringe";
import { ApiResponse } from "../types/api";

@singleton()
export class Hideout {
  api: Api;

  constructor() {
    this.api = container.resolve(Api);
  }

  async getAreas() {
    const result: ApiResponse<IHideoutArea[]> = await this.api.prod.post('client/hideout/areas');
    return result.body.data;
  }

  async getSettings() {
    const result: ApiResponse<IHideoutSetting[]> = await this.api.prod.post('client/hideout/production/recipes');
    return result.body.data;
  }

  async getProductionRecipes() {
    const result: ApiResponse<IProductionRecipe[]> = await this.api.prod.post('client/hideout/production/recipes');
    return result.body.data;
  }

  async getScavcaseRecipes() {
    const result: ApiResponse<IScavCaseSettings[]> = await this.api.prod.post('client/hideout/production/scavcase/recipes');
    return result.body.data;
  }

}