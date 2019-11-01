const AMPD_URL = 'punica:8003';

export const environment = {
  production: true,
  coverServer: `http://${AMPD_URL}`,
  webSocketServer: `ws://${AMPD_URL}/mpd`,
  ampdVersion: '2019-11-01 16:54 (3a04f14314e1d224533c988219af0fbfba34af64)',
};
