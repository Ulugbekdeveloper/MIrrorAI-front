import { silver } from '@/theme';

export type ClothingCategory = 'tops' | 'bottoms' | 'outerwear' | 'fullLooks';

export type ClothingItem = {
  id: string;
  name: string;
  /**
   * S3 key for this catalog garment, pre-uploaded by the backend ahead of
   * time — catalog images are never uploaded by the app itself, only the
   * user's own photo is. This lets `tryOnApi.start({ personKey, garmentKey })`
   * work unchanged once a real catalog exists; only `personKey` needs a
   * fresh upload per job.
   */
  garmentKey: string;
  /** Placeholder swatch color — no real product photography is bundled yet. */
  swatch: string;
};

export const CLOTHING_TABS: { key: ClothingCategory; label: string }[] = [
  { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'fullLooks', label: 'Full Looks' },
];

export const CLOTHING_CATALOG: Record<ClothingCategory, ClothingItem[]> = {
  tops: [
    { id: 'top-1', name: 'Classic White Tee', garmentKey: 'catalog/tops/white-tee.jpg', swatch: silver[100] },
    { id: 'top-2', name: 'Black Turtleneck', garmentKey: 'catalog/tops/black-turtleneck.jpg', swatch: silver[800] },
    { id: 'top-3', name: 'Striped Knit', garmentKey: 'catalog/tops/striped-knit.jpg', swatch: silver[500] },
    { id: 'top-4', name: 'Silk Blouse', garmentKey: 'catalog/tops/silk-blouse.jpg', swatch: silver[300] },
    { id: 'top-5', name: 'Graphic Tee', garmentKey: 'catalog/tops/graphic-tee.jpg', swatch: silver[400] },
    { id: 'top-6', name: 'Linen Shirt', garmentKey: 'catalog/tops/linen-shirt.jpg', swatch: silver[200] },
  ],
  bottoms: [
    { id: 'bottom-1', name: 'Tailored Trousers', garmentKey: 'catalog/bottoms/tailored-trousers.jpg', swatch: silver[700] },
    { id: 'bottom-2', name: 'Slim Denim', garmentKey: 'catalog/bottoms/slim-denim.jpg', swatch: silver[600] },
    { id: 'bottom-3', name: 'Pleated Skirt', garmentKey: 'catalog/bottoms/pleated-skirt.jpg', swatch: silver[300] },
    { id: 'bottom-4', name: 'Cargo Pants', garmentKey: 'catalog/bottoms/cargo-pants.jpg', swatch: silver[500] },
    { id: 'bottom-5', name: 'Wide-Leg Linen', garmentKey: 'catalog/bottoms/wide-leg-linen.jpg', swatch: silver[200] },
    { id: 'bottom-6', name: 'Leather Shorts', garmentKey: 'catalog/bottoms/leather-shorts.jpg', swatch: silver[800] },
  ],
  outerwear: [
    { id: 'outer-1', name: 'Wool Overcoat', garmentKey: 'catalog/outerwear/wool-overcoat.jpg', swatch: silver[700] },
    { id: 'outer-2', name: 'Denim Jacket', garmentKey: 'catalog/outerwear/denim-jacket.jpg', swatch: silver[600] },
    { id: 'outer-3', name: 'Bomber Jacket', garmentKey: 'catalog/outerwear/bomber-jacket.jpg', swatch: silver[900] },
    { id: 'outer-4', name: 'Trench Coat', garmentKey: 'catalog/outerwear/trench-coat.jpg', swatch: silver[400] },
    { id: 'outer-5', name: 'Puffer Vest', garmentKey: 'catalog/outerwear/puffer-vest.jpg', swatch: silver[300] },
    { id: 'outer-6', name: 'Leather Biker', garmentKey: 'catalog/outerwear/leather-biker.jpg', swatch: silver[950] },
  ],
  fullLooks: [
    { id: 'look-1', name: 'Night Out Set', garmentKey: 'catalog/full-looks/night-out.jpg', swatch: silver[800] },
    { id: 'look-2', name: 'Weekend Casual', garmentKey: 'catalog/full-looks/weekend-casual.jpg', swatch: silver[400] },
    { id: 'look-3', name: 'Office Sharp', garmentKey: 'catalog/full-looks/office-sharp.jpg', swatch: silver[600] },
    { id: 'look-4', name: 'Street Layered', garmentKey: 'catalog/full-looks/street-layered.jpg', swatch: silver[700] },
    { id: 'look-5', name: 'Minimal Monochrome', garmentKey: 'catalog/full-looks/minimal-mono.jpg', swatch: silver[200] },
    { id: 'look-6', name: 'Athleisure Edge', garmentKey: 'catalog/full-looks/athleisure-edge.jpg', swatch: silver[500] },
  ],
};
