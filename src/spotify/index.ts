import { SpotifyAPI } from '@statsfm/spotify.js';

export const spotify = new SpotifyAPI({
  clientCredentials: {
    clientId: 'f57ed54bc6af45d0a770e985b6ea9bb7',
    clientSecret: process.env.SPOTIFY_SECRET,
  },
});
