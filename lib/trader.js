function Trader(options) {
  if (!(this instanceof Trader)) return new Trader(options);
  
  this.id = options._id;
  this.working = options.working;
  this.customization_seller = options.customization_seller;
  this.name = options.name;
  this.surname = options.surname;
  this.nickname = options.nickname
  this.location = options.location;
  this.avatar = options.avatar;
  this.balance_rub = options.balance_rub;
  this.balance_dol = options.balance_dol;
  this.balance_eur = options.balance_eur;
  this.display = options.display;
  this.discount = options.discount;
  this.discount_end = options.discount;
  this.buyer_up = options.buyer_up;
  this.currency = options.currency;
  this.supply_next_time = options.supply_next_time;
  this.repair = options.repair;
  this.insurance = options.insurance;
  this.gridHeight = options.gridHeight;
  this.loyalty = options.loyalty;
  this.sell_category = options.sell_category;

  // We have localization data to this trader
  if(LOCAL_STRINGS.trading[options._id]) {
    let local = LOCAL_STRINGS.trading[options._id];
    this.name = local.FirstName;
    this.surname = getSurname(local);
    this.location = local.Location;
    this.nickname = local.Nickname;
    this.description = local.Description;
  }
}

function info(o) {
  return Object.keys(o).reduce((c, k) => (c[k.toLowerCase()] = o[k], c), {});
}

function getSurname(local) {
  let firstname = `${local.FirstName} `;
  return local.FullName.replace(firstname, '');
}

module.exports = Trader;