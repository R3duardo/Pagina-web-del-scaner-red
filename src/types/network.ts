export interface Port {
  id: number;
  host_id: number;
  port_number: number;
  service_name: string;
  protocol: string;
  state: string;
  last_seen: string;
  created_at: string;
}

export interface Host {
  id: number;
  ip_address: string;
  hostname: string | null;
  mac_address: string | null;
  last_seen: string;
  created_at: string;
  ports: Port[];
}

export interface HostsResponse {
  success: boolean;
  count: number;
  hosts: Host[];
}
