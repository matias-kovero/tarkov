const rub_id = '5449016a4bdc2d6f028b456f';
const usd_id = '5696686a4bdc2da3298b456a';
const eur_id = '569668774bdc2da2298b4568';
/**
 * Tarkov profile
 * @param {*} options 
 * @class
 * @hideconstructor
 */
function Profile(options) {
  if (!(this instanceof Profile)) return new Profile(options);

  this.options = options;

  this.id = options._id;
  this.aid = options.aid;
  this.savage = options.savage;
  this.info = info(options.Info);
  this.customization = options.Customization;
  this.health = options.Health;
  this.inventory = item(options.Inventory);
  this.skills = options.Skills;
}

function info(o) {
  return Object.keys(o).reduce((c, k) => (c[k.toLowerCase()] = o[k], c), {});
}

function item(o) {
  return Object.keys(o).reduce((c, k) => (c[k.toLowerCase()] = o[k], c), {});
}

/**
 * Gets all roubles stacks from inventory.
 * @returns {Object} {amount: amount of roubles, stacks: [Array of items] }
 */
Profile.prototype.getRoubles = async function() {
  let amount_of_roubles = 0;
  let stacks = this.inventory.items.filter(i => i._tpl === rub_id);
  
  stacks.forEach(stack => {
    if(stack.upd.StackObjectsCount) amount_of_roubles += stack.upd.StackObjectsCount
  });

  return {amount: amount_of_roubles, stacks: stacks};
}

/**
 * Gets all dollars stacks from inventory.
 * @returns {Object} {amount: amount of dollars, stacks: [Array of items] }
 */
Profile.prototype.getDollars = async function() {
  let amount_of_dollars = 0;
  let stacks = this.inventory.items.filter(i => i._tpl === rub_id);
  
  stacks.forEach(stack => {
    if(stack.upd.StackObjectsCount) amount_of_dollars += stack.upd.StackObjectsCount
  });

  return {amount: amount_of_dollars, stacks: stacks};
}

/**
 * Gets all euros stacks from inventory.
 * @returns {Object} {amount: amount of euros, stacks: [Array of items] }
 */
Profile.prototype.getEuros = async function() {
  let amount_of_euros = 0;
  let stacks = this.inventory.items.filter(i => i._tpl === rub_id);
  
  stacks.forEach(stack => {
    if(stack.upd.StackObjectsCount) amount_of_euros += stack.upd.StackObjectsCount
  });

  return {amount: amount_of_euros, stacks: stacks};
}

Profile.prototype.updateItems = async function(items) {
  return new Promise((resolve, reject) => {
    try {
      items.forEach(item => {
        let index = this.inventory.items.findIndex(i => i._id === item._id);
        if(index != -1) {
          this.inventory.items[index] = item;
        }
      });
      setTimeout(() => {resolve('ok');}, 200);
    } catch(error) {reject(error)};
  });
}

Profile.prototype.addItems = async function(items) {
  return new Promise((resolve, reject) => {
    try {
      items.forEach(item => {
        this.inventory.items.push(item);  
      });
      setTimeout(() => {resolve('ok');}, 200);
    } catch(error) {reject(error)};
  });
}

Profile.prototype.removeItems = async function(items) {
  return new Promise((resolve, reject) => {
    try {
      items.forEach(item => {
        let index = this.inventory.items.findIndex(i => i._id === item._id);
        if(index != -1) {
          this.inventory.items.splice(index, 1);
        };
      });
      setTimeout(() => {resolve('ok');}, 200);
    } catch(error) {reject(error)};
  });
}

/**
 * Searches inventory for item_id(_tpl), if found returns array of items.
 */
Profile.prototype.getItems = async function(item_id) {
  let items = this.inventory.items.filter(i => i._tpl === item_id);
  return {count: items.length, items: items };
}

/**
 * Searches invetory for specific item, if found returns item.
 */
Profile.prototype.getItemById = async function(item_id) {
  let item = this.inventory.items.find(i => i._id === item_id);
  return item;
}

module.exports = Profile;