import { QrfTemplate } from './workflow-qrf-template.model'

export interface IWorkflowinfoData extends Object {
  learnMore: string
  why: string
  what: string | QrfTemplate
  disposition: [[0, string], [1, string], [2, string], [3, string], [4, string]]
  autoText: string
}
