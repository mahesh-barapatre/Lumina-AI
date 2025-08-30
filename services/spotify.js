// services/spotify.js
const axios = require("axios");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const market = process.env.SPOTIFY_MARKET || "US";

let _token = null;
let _tokenExpiresAt = 0;

async function getToken() {
  const now = Date.now();
  if (_token && now < _tokenExpiresAt - 10_000) {
    return _token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  _token = res.data.access_token;
  _tokenExpiresAt = Date.now() + res.data.expires_in * 1000; // seconds → ms
  return _token;
}

async function spotifyGET(path, params = {}) {
  const token = await getToken();
  const res = await axios.get(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
}

/**
 * Try: find playlists for a mood, take first one, pull 3 tracks.
 * Fallback: direct track search by mood keyword.
 */
async function getTracksForMood(moodQuery, limit = 3) {
  // 1) Try playlists first
  try {
    const pl = await spotifyGET("/search", {
      q: moodQuery,
      type: "playlist",
      market,
      limit: 5,
    });

    const playlist = pl.playlists?.items?.[0];
    if (playlist?.id) {
      const tracksRes = await spotifyGET(`/playlists/${playlist.id}/tracks`, {
        market,
        limit: 30,
      });

      const items = (tracksRes.items || [])
        .map((it) => it.track)
        .filter(Boolean);

      const picks = items.slice(0, limit);
      if (picks.length) {
        return picks.map(formatTrack);
      }
    }
  } catch (e) {
    // ignore and fallback
  }

  // 2) Fallback: search tracks by moodQuery
  const tr = await spotifyGET("/search", {
    q: moodQuery,
    type: "track",
    market,
    limit: limit * 3, // grab a few more, we will slice
  });

  const tracks = tr.tracks?.items || [];
  return tracks.slice(0, limit).map(formatTrack);
}

function formatTrack(t) {
  return {
    id: t.id,
    name: t.name,
    artists: (t.artists || []).map((a) => a.name).join(", "),
    url: t.external_urls?.spotify,
    albumImage: t.album?.images?.[0]?.url,
    previewUrl: t.preview_url || null,
  };
}

module.exports = {
  getTracksForMood,
};
