export const dataImage = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/img/**/*.{jpg,jpeg,png,gif}',
  { eager: true },
);
