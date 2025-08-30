// utils/cooldowns.js
const userCooldowns = new Map();

function checkCooldown(userId, cmd, cooldownMs = 30000) {
  const now = Date.now();
  const key = `${userId}:${cmd}`;
  const last = userCooldowns.get(key) || 0;

  if (now - last < cooldownMs) {
    return false; // still on cooldown
  }

  userCooldowns.set(key, now);
  return true;
}

module.exports = { checkCooldown };
