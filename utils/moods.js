// utils/moods.js
const moodMap = {
  chill: "chill lofi",
  focus: "focus lofi beats",
  study: "study beats",
  happy: "feel good pop",
  sad: "mellow sad",
  workout: "workout pump",
  party: "party hits",
  romance: "romantic acoustic",
  sleep: "sleep calm",
  jazz: "smooth jazz",
  rain: "rainy day jazzy",
  coding: "coding lofi",
  chillhop: "chillhop",
  lofi: "lofi",
};

function moodToQuery(input) {
  if (!input) return "chill lofi";
  const key = String(input).trim().toLowerCase();
  return moodMap[key] || key; // default to raw key if not mapped
}

module.exports = { moodToQuery };
