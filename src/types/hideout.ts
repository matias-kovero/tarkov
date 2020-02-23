interface IHideoutArea {
  _id: string;
  type: number;
  enabled: boolean;
  needsFuel: boolean;
  takeFromSlotLocked: boolean;
  stages: IStages;
}

interface IStages {
  [key: string]: IStage;
}

interface IStage {
  requirements: IRequirement[];
  bonuses: IBonus[];
  slots: number;
  constructionTime: number;
  description: string;
}

interface IRequirement {
  templateId: string;
  count: number;
  isFunctional: boolean;
  type: 'Item' | 'Area' | 'TraderLoyalty';
}

interface IBonus {
  value: number;
  passive: boolean;
  production: boolean;
  visible: boolean;
  type: 'UnlockWeaponModification' | 'TextBonus';
}


interface IProductionRecipe {
  _id: string;
  areaType: number;
  requirements: IRecipeRequirement[];
  continuous: boolean;
  productionTime: number;
  endProduct: string;
  count: number;
  productionLimitCount: number;
}

interface IRecipeRequirement {
  templateId?: string;
  count?: number;
  isFunctional?: boolean;
  type: string;
  areaType?: number;
  requiredLevel?: number;
}

// Hideout Settings

interface IHideoutSetting {
  _id: string;
  areaType: number;
  requirements: IHideoutSettingRequirement[];
  continuous: boolean;
  productionTime: number;
  endProduct: string;
  count: number;
  productionLimitCount: number;
}

interface IHideoutSettingRequirement {
  areaType?: number;
  requiredLevel?: number;
  type: string;
  templateId?: string;
  count?: number;
  isFunctional?: boolean;
  resource?: number;
}

// Scav Case Settings

interface IScavCaseSettings {
  _id: string;
  ProductionTime: number;
  Requirements: IScavCaseRequirement[];
  EndProducts: IEndProducts;
}

interface IEndProducts {
  Common: ICommon;
  Rare: ICommon;
  Superrare: ICommon;
}

interface ICommon {
  min: string;
  max: string;
}

interface IScavCaseRequirement {
  templateId: string;
  count: number;
  isFunctional: boolean;
  type: string;
}