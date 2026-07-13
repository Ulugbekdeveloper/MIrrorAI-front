// require() arguments must be static string literals for Metro to bundle
// them — this is why each image is required inline rather than built from
// a path variable.
export const slides = [
  {
    image: require('@assets/images/2.jpg'),
    title: 'Dress for the memory.',
    description:
      'Effortlessly magnetic outfits for when you want to feel unforgettable.',
  },
  {
    image: require('@assets/images/3.jpg'),
    title: 'Main Character Comfort.',
    description:
      'Relaxed, low-effort styles that still look completely put together.',
  },
  {
    image: require('@assets/images/4.jpg'),
    title: 'Unstoppable Energy.',
    description:
      'High-performance aesthetics to unlock your inner athlete.',
  },
   {
    image: require('@assets/images/5.jpg'),
    title: 'Power Moves Only.',
    description:
      'Sharp, structured armor tailored for confidence and respect.',
  },
  {
    image: require('@assets/images/6.jpg'),
    title: 'Own the Night in Perfect Style.',
    description:
      'Use AI to curate, preview, and style the ultimate outfit for any occasion—instantly.',
  }
] as const;
