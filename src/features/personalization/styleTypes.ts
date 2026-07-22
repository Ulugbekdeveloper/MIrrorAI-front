import type { GenderKey } from './types';


function titleFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  return withoutExtension
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const LABEL_OVERRIDES: Partial<Record<string, string>> = {
  'corquette.jpg': 'Coquette',
};

function styleType(filename: string, image: ReturnType<typeof require>) {
  return {
    key: filename.replace(/\.[^/.]+$/, ''),
    label: LABEL_OVERRIDES[filename] ?? titleFromFilename(filename),
    image,
  };
}

export const STYLE_TYPE_OPTIONS_WOMAN = [
  styleType('classic.jpg', require('@assets/images/style-types-woman/classic.jpg')),
  styleType('minimal.jpg', require('@assets/images/style-types-woman/minimal.jpg')),
  styleType('street.webp', require('@assets/images/style-types-woman/street.webp')),
  styleType('old-money.jpg', require('@assets/images/style-types-woman/old-money.jpg')),
  styleType('preppy.jpg', require('@assets/images/style-types-woman/preppy.jpg')),
  styleType('edgy.webp', require('@assets/images/style-types-woman/edgy.webp')),
  styleType('romantic.avif', require('@assets/images/style-types-woman/romantic.avif')),
  styleType('sport.jpg', require('@assets/images/style-types-woman/sport.jpg')),
  styleType('glam.webp', require('@assets/images/style-types-woman/glam.webp')),
  styleType('corquette.jpg', require('@assets/images/style-types-woman/corquette.jpg')),
  styleType('eclectic.webp', require('@assets/images/style-types-woman/eclectic.webp')),
  styleType('alternative.jpg', require('@assets/images/style-types-woman/alternative.jpg')),
] as const;

export const STYLE_TYPE_OPTIONS_MAN = [
  styleType('classic.webp', require('@assets/images/style-types-man/classic.webp')),
  styleType('minimal.avif', require('@assets/images/style-types-man/minimal.avif')),
  styleType('street.webp', require('@assets/images/style-types-man/street.webp')),
  styleType('old-money.jpg', require('@assets/images/style-types-man/old-money.jpg')),
  styleType('tailored.webp', require('@assets/images/style-types-man/tailored.webp')),
  styleType('edgy.jpg', require('@assets/images/style-types-man/edgy.jpg')),
  styleType('relaxed.jpg', require('@assets/images/style-types-man/relaxed.jpg')),
  styleType('sport.webp', require('@assets/images/style-types-man/sport.webp')),
  styleType('rugged.avif', require('@assets/images/style-types-man/rugged.avif')),
  styleType('techwear.avif', require('@assets/images/style-types-man/techwear.avif')),
  styleType('y2k.jpg', require('@assets/images/style-types-man/y2k.jpg')),
  styleType('eclectic.jpg', require('@assets/images/style-types-man/eclectic.jpg')),
  styleType('creative.avif', require('@assets/images/style-types-man/creative.avif')),
  styleType('alternative.jpg', require('@assets/images/style-types-man/alternative.jpg')),
] as const;



export type StyleTypeOption = | (typeof STYLE_TYPE_OPTIONS_WOMAN)[number] | (typeof STYLE_TYPE_OPTIONS_MAN)[number];
export type StyleTypeKey = StyleTypeOption['key'];



export function getStyleTypeOptions(gender: GenderKey | null): readonly StyleTypeOption[] {
  return gender === 'man' ? STYLE_TYPE_OPTIONS_MAN : STYLE_TYPE_OPTIONS_WOMAN;
}
