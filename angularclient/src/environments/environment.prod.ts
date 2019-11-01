const AMPD_URL = 'punica:8003';

export const environment = {
  production: true,
  coverServer: `http://${AMPD_URL}`,
  webSocketServer: `ws://${AMPD_URL}/mpd`,
  ampdVersion: '2019-11-01 17:35 (c83e5851b3449bc636d806f5685893b99da12175)',
};
