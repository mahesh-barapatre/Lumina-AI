// utils/safeGoogleCall.js
//----------------------------------------------------------------------

// this feature is in progress
// wrap the google api calls for safety

//---------------------------------------------------------------------
async function safeGoogleCall(fn, retries = 2) {
  try {
    const data = await fn();
    return { data };
  } catch (err) {
    if (retries > 0 && isTransientError(err)) {
      console.warn("Retrying Google API call...");
      return safeGoogleCall(fn, retries - 1);
    }
    console.error("Google API failed:", err);
    return { error: err };
  }
}

function isTransientError(err) {
  if (!err) return false;
  const code = err.code || err.response?.status;
  return [429, 500, 502, 503, 504].includes(code);
}

module.exports = { safeGoogleCall };
