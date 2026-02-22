// types/contentlayer.d.ts
declare module "contentlayer/generated/types" {
  export type Project = import("contentlayer/generated").Project
  export type Publication = import("contentlayer/generated").Publication
}

declare module "contentlayer/generated/Project/_index.mjs" {
  import type { Project } from "contentlayer/generated/types"
  export const allProjects: Project[]
}

declare module "contentlayer/generated/Publication/_index.mjs" {
  import type { Publication } from "contentlayer/generated/types"
  export const allPublications: Publication[]
}