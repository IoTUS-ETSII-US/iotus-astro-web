import type { InferEntrySchema, RenderedContent } from "astro:content"

export interface Project {
  id: string
  body?: string
  collection: 'projects'
  data: InferEntrySchema<'projects'>
  rendered?: RenderedContent
  filePath?: string
  digest?: string | number
}
