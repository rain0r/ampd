const AMPD_URL = 'punica:8003';

export const environment = {
  production: true,
  coverServer: `http://${AMPD_URL}`,
  webSocketServer: `ws://${AMPD_URL}/mpd`,
  ampdVersion: '2019-10-05 17:43 (1960fe60a8a343d4f7483098ea4cf9ab814e05bb)',
};
