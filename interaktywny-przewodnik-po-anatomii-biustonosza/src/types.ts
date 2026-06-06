export type BraPartId =
  | 'material'
  | 'koronka'
  | 'tiul_elastyczny'
  | 'tiul_stabilny'
  | 'guma_obszywkowa'
  | 'guma_ramiackowa'
  | 'kolka'
  | 'regulatory'
  | 'haftka'
  | 'fiszbiny'
  | 'kokardka'
  | 'tunel_gorseciarski'
  | 'miseczki';

export interface BraPart {
  id: BraPartId;
  name: string;
  category: 'fabric' | 'tulle' | 'elastic' | 'hardware' | 'support' | 'accessory';
  categoryLabel: string;
  description: string;
  sewingRole: string; // Dynamic role in Polish, e.g. "Stabilizacja ramy", "Komfort i elastyczność"
  typicalProperties: string; // e.g. "Szerokość: 10-15mm"
  sewingTip: string; // Tip for sewing in Polish
  color: string; // Default highlight color
}
