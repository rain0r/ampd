const AMPD_URL = 'punica:8003';

export const environment = {
  production: true,
  coverServer: `http://${AMPD_URL}`,
  webSocketServer: `ws://${AMPD_URL}/mpd`,
  ampdVersion: '2019-12-22 19:27 (3112f9b5d469a7feeb19215d7902c16265573bf7)',
};
