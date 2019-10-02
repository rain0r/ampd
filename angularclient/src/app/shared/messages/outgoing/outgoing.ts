declare module 'OutgoingMsg' {
  export interface IPayload {
    query: string;
  }

  export interface IOutgoingRoot {
    type: string;
    payload: IPayload;
  }
}
