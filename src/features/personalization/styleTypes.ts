// Metro requires `require()` arguments to be static string literals, so
// each image is declared explicitly rather than built from a path variable
// (see also src/features/onboarding/slides.ts for the same constraint).

function titleFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  return withoutExtension
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Corrects source-asset filename typos without renaming the file on disk. */
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

export const STYLE_TYPE_OPTIONS = [
  styleType('classic.jpg', require('@assets/images/style-types/classic.jpg')),
  styleType('minimal.jpg', require('@assets/images/style-types/minimal.jpg')),
  styleType('street.webp', require('@assets/images/style-types/street.webp')),
  styleType('old-money.jpg', require('@assets/images/style-types/old-money.jpg')),
  styleType('preppy.jpg', require('@assets/images/style-types/preppy.jpg')),
  styleType('edgy.webp', require('@assets/images/style-types/edgy.webp')),
  styleType('romantic.avif', require('@assets/images/style-types/romantic.avif')),
  styleType('sport.jpg', require('@assets/images/style-types/sport.jpg')),
  styleType('glam.webp', require('@assets/images/style-types/glam.webp')),
  styleType('corquette.jpg', require('@assets/images/style-types/corquette.jpg')),
  styleType('eclectic.jpg', require('@assets/images/style-types/eclectic.jpg')),
  styleType('alternative.jpg', require('@assets/images/style-types/alternative.jpg')),
] as const;

export type StyleTypeOption = (typeof STYLE_TYPE_OPTIONS)[number];
export type StyleTypeKey = StyleTypeOption['key'];
