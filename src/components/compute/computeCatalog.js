export const gpuModels = ['H100 SXM', 'H200', 'B200', 'B300'];
export const requestTypes = ['bulk', 'forward', 'hosting', 'custom'];
export const dataCenters = [
  {
    name: 'Digital Realty · SIN11',
    location: { zh: '新加坡 · 3 Loyang Way', en: 'Singapore · 3 Loyang Way' },
    power: { zh: 'UPS N+1；MW 容量未在该页面公开', en: 'N+1 UPS; MW capacity not disclosed on the source page' },
    racks: { zh: '单机柜至专属套间，价格与空余需确认', en: 'Single cabinets to full suites; pricing and vacancy require confirmation' },
    network: { zh: '新加坡机房互联与运营商资源，端口和带宽需确认', en: 'Singapore interconnection and carrier resources; confirm ports and bandwidth' },
    source: 'https://www.digitalrealty.com/data-centers/asia-pacific/singapore/sin11'
  },
  {
    name: 'Runpod · Global Networking',
    location: { zh: '美国 US-TX-3 · 欧洲 EU-NL-1 · 澳洲 OC-AU-1 等公开节点', en: 'Public locations include US-TX-3, EU-NL-1 and OC-AU-1' },
    power: { zh: '供电 MW 与冗余未在该页面公开', en: 'Power MW and redundancy not disclosed on the source page' },
    racks: { zh: '公开 GPU 云节点；非机柜托管报价', en: 'Public cloud GPU locations, not a colocation offer' },
    network: { zh: 'Global Networking 跨节点私有网络；链路与带宽需确认', en: 'Global Networking private cross-location connectivity; confirm links and bandwidth' },
    source: 'https://www.runpod.io/blog/runpod-global-networking-expansion'
  }
];