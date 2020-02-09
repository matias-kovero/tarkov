require('./globals');
/**
 * Generate a random EFT compatible Hardware ID.
 */
function generate_hwid() {

  /**
   * Return shortened md5 value.
   */
  function short_md5() {
    let hash = random_md5();
    return hash.substring(0, hash.length - 8);
  }

  return `#1-${random_md5()}:${random_md5()}:${random_md5()}-${random_md5()}-${random_md5()}-${random_md5()}-${random_md5()}-${short_md5()}`;
}

/**
 * Create random md5 value.
 */
function random_md5() {
  return crypto.createHash('md5').update(Math.random().toString()).digest('hex');
}

module.exports = generate_hwid;