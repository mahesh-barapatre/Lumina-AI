// utils/random.js
const crypto = require("crypto");

function dailySeed(userId) {
  const d = new Date();
  const day = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  return crypto.createHash("md5").update(`${userId}:${day}`).digest("hex");
}

function pickN(arr, n, seedHex) {
  // deterministic shuffle using seed
  const rng = mulberry32(seedHexToInt(seedHex));
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function seedHexToInt(hex) {
  // take first 8 chars → uint32
  return parseInt(hex.slice(0, 8), 16) >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = { dailySeed, pickN };
