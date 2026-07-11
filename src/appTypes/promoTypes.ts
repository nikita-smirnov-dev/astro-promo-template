import { z } from 'zod';

export const BasePromoSchema = z.object({
  title: z.string(),
  plot: z.string(),
  poster: z.string(),
  genre: z.string(),
  releaseName: z.string(),
  releaseYear: z.number(),
  runtime: z.string(),
  tracks: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        duration: z.string(),
        fileUrl: z.string(),
      }),
    )
    .optional(),
});

export type PromoDataT = z.infer<typeof BasePromoSchema>;

export type PosterUrl = PromoDataT['poster'];
// export type PosterImage = z.infer<typeof PosterImageSchema>;
