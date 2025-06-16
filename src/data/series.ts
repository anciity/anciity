import { type CollectionEntry, getCollection } from 'astro:content'

/** filter out draft series based on the environment */
export async function getAllSeries(): Promise<CollectionEntry<'series'>[]> {
  return await getCollection('series', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true
  })
}

/** returns all unique series that are featured
 *  Note: This function doesn't filter draft series, pass it the result of getAllSeries above to do so.
 */
export function getFeaturedSeries(series: CollectionEntry<'series'>[]) {
  return series.filter(s => s.data.featured)
}
