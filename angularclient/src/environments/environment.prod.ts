const AMPD_URL = 'punica:8003';

export const environment = {
  production: true,
  coverServer: `http://${AMPD_URL}`,
  webSocketServer: `ws://${AMPD_URL}/mpd`,
  ampdVersion: '2019-09-21 20:00',
};
