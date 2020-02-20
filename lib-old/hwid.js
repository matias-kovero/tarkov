require('./globals');
/**
 * Generate a random EFT compatible Hardware ID.
 * @returns {String} EFT compatible Hardware ID.
 */
function generate_hwid() {

  /**
   * Return shortened md5 value.
   * @private
   */
  function short_hash() {
    let hash = random_hash();
    return hash.substring(0, hash.length - 8);
  }

  return `#1-${random_hash()}:${random_hash()}:${random_hash()}-${random_hash()}-${random_hash()}-${random_hash()}-${random_hash()}-${short_hash()}`;
}

/**
 * Create random md5 value.
 * @private
 */
function random_hash() {
  let hash = crypto.createHash('sha1').update(Math.random().toString()).digest('hex')
  return hash;
}

module.exports = generate_hwid;