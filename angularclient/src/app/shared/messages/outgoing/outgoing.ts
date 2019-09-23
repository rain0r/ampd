declare module 'OutgoingMsg' {
  export interface Payload {
    query: string;
  }

  export interface OutgoingRoot {
    type: string;
    payload: Payload;
  }
}
