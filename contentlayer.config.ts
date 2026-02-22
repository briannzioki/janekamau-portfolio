import { defineDocumentType, makeSource } from "contentlayer2/source-files"

const computedSlug = {
  slug: { type: "string" as const, resolve: (doc: any) => doc._raw.sourceFileName.replace(/\.mdx?$/, "") },
}

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false },
    cover: { type: "string", required: false },
    category: { type: "enum", options: ["poster","illustration","branding"], required: true },
    year: { type: "number", required: false },
    role: { type: "string", required: false },
    tools: { type: "list", of: { type: "string" }, required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    gallery: { type: "json", required: false },
    link: { type: "string", required: false },
  },
  computedFields: computedSlug,
}))

export const Publication = defineDocumentType(() => ({
  name: "Publication",
  filePathPattern: `publications/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false },
    cover: { type: "string", required: false },
    file: { type: "string", required: true },
    year: { type: "number", required: false },
    venue: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    tools: { type: "list", of: { type: "string" }, required: false },
    role: { type: "string", required: false },
    gallery: { type: "json", required: false },
  },
  computedFields: computedSlug,
}))

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Project, Publication],
  disableImportAliasWarning: true,
})