export type HantHeaders = {
  Authorization: string;
};

export type HantHeadersHash = {
  'content-type': string;
  appkey: string;
  appsecret: string;
};

export type HantHeadersAccess = {
  grant_type: string;
  appkey: string;
  appsecret: string;
};

export type HantHeadersAccessSocket = {
  grant_type: string;
  appkey: string;
  secretkey: string;
};
