export interface ProxyLookup {
  ip: string
  count: number
  country_code: string
  country_name: string
  is_eu: boolean
  timezone: string
  region: string
  region_code: string
  city: string
  latitude: number
  longitude: number
  postal: string
  asn: string
  isp: string
  vpn: boolean
  tor_node: boolean
  datacenter: boolean
  public_proxy: boolean
  web_proxy: boolean
  search_robot: boolean
  avastel?: any
  os: string
  timestamp: number
}
