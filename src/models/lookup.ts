export interface ProxyLookup {
  ip: string;
  country: string;
  asn: Asn;
  geo: Geo;
  method: string;
  httpVersion: string;
  url: string;
  headers: Headers;
}


export interface Asn {
    asnum: number;
    org_name: string;
}

export interface Geo {
    city: string;
    region: string;
    region_name: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    tz: string;
    lum_city: string;
    lum_region: string;
}

export interface Headers {
    [key: string]: string;
}