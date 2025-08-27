taskra-bot/
│
├── src/
│ └── index.js # discord client + command loader
│
├── commands/
│ ├── ping.js
│ ├── help.js
│ ├── remind.js
│ ├── meet.js
│ ├── events.js
│ ├── music.js
│ └── hangout.js
│
├── services/
│ ├── db.js # mongoose connect
│ ├── scheduler.js # node-cron jobs
│ ├── google.js # Google OAuth + Calendar helpers
│ ├── spotify.js # Spotify client
│ ├── maps.js # Places/Geocode helpers
│ └── llm.js # Groq intent parser (optional)
│
├── models/
│ ├── Reminder.js
│ └── UserToken.js
│
├── web/
│ └── server.js # express for oauth callbacks + /health
│
├── .env.example # environment variables sample
├── .gitignore # tells git what to ignore
├── package.json # project dependencies + scripts
└── README.md # documentation
