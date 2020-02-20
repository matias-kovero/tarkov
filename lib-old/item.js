function Item(options) {
  if (!(this instanceof Item)) return new Item(options);

  this.id = options[0].toString();

  options = options[1];
  /*
  { _id: '5b432b965acfc47a8774094e',
  _name: 'item_equipment_headset_gsh01',
  _parent: '5645bcb74bdc2ded0b8b4578',
  _type: 'Item',
  _props:
   { Name: 'Peltor ComTac 2 headset',
     ShortName: 'ComTac2',
     Description: 'Headset',
     Weight: 0.5,
     BackgroundColor: 'default',
     Width: 2,
     Height: 2,
     StackMaxSize: 1,
     Rarity: 'Rare',
     SpawnChance: 6,
     CreditsPrice: 11962,
     ItemSound: 'gear_goggles',
     Prefab:
      { path:
         'assets/content/items/equipment/headset_gsh01/item_equipment_headset_gsh01.bundle',
        rcid: '' },
     UsePrefab: { path: '', rcid: '' },
     StackObjectsCount: 1,
     NotShownInSlot: false,
     ExaminedByDefault: false,
     ExamineTime: 1,
     IsUndiscardable: false,
     IsUnsaleable: false,
     IsUnbuyable: false,
     IsUngivable: false,
     IsLockedafterEquip: false,
     QuestItem: false,
     LootExperience: 20,
     ExamineExperience: 4,
     HideEntrails: false,
     RepairCost: 0,
     RepairSpeed: 0,
     ExtraSizeLeft: 0,
     ExtraSizeRight: 0,
     ExtraSizeUp: 0,
     ExtraSizeDown: 0,
     ExtraSizeForceAdd: false,
     MergesWithChildren: false,
     CanSellOnRagfair: true,
     CanRequireOnRagfair: true,
     BannedFromRagfair: false,
     ConflictingItems: [],
     FixedPrice: false,
     Unlootable: false,
     UnlootableFromSlot: 'FirstPrimaryWeapon',
     UnlootableFromSide: [],
     ChangePriceCoef: 1,
     AllowSpawnOnLocations: [],
     SendToClient: false,
     AnimationVariantsNumber: 0,
     DiscardingBlock: false,
     Grids: [],
     Slots: [],
     CanPutIntoDuringTheRaid: true,
     CantRemoveFromSlotsDuringRaid: [],
     BlocksEarpiece: false,
     BlocksEyewear: false,
     BlocksHeadwear: false,
     BlocksFaceCover: false,
     Distortion: 0.33,
     CompressorTreshold: -20,
     CompressorAttack: 35,
     CompressorRelease: 255,
     CompressorGain: 10,
     CutoffFreq: 175,
     Resonance: 4,
     CompressorVolume: -3,
     AmbientVolume: -2,
     DryVolume: -60 },
  _proto: '5645bcc04bdc2d363b8b4572' }
   */
  this.id = options._id;
  this.name = options._name;
  this.parent = options._parent;
  this.type = options._type;
  this.props = {
    name: options._props.Name,
    shortname: options._props.ShortName,
    description: options._props.Description,
    weight: options._props.Weight,
    bgcolor: options._props.BackgroundColor,
    width: options._props.Width,
    height: options._props.Height,
    stackMaxSize: options._props.StackMaxSize,
    rarity: options._props.Rarity,
    spawnChance: options._props.SpawnChance,
    creditsPrice: options._props.CreditsPrice,
    itemSound: options._props.ItemSound,
    stackObjectCount: options._props.stackObjectCount,
    notSlownInSlot: options._props.NotShownInSlot,
    isUndiscardable: options._props.IsUndiscardable,
    isUnBuyable: options._props.IsUnBuyable,
    questItem: options._props.QuestItem,
    canSellOnRagfair: options._props.CanSellOnRagfair,
    grids: options._props.Grids,
    slots: options._props.Slots,
  };
  this.proto = options._proto;

  // We have localization data to this trader
  if(LOCAL_STRINGS.templates[options._id]) { // _id || _tpl
    let local = LOCAL_STRINGS.templates[options._id];
    this.props.name = local.Name;
    this.props.shortname = local.ShortName;
    this.props.description = local.Description;
  }
}

function info(o) {
  return Object.keys(o).reduce((c, k) => (c[k.toLowerCase()] = o[k], c), {});
}

module.exports = Item;