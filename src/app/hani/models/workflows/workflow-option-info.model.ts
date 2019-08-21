import { IQrfTemplate } from './workflow-qrf-template.model'
import { WorkflowDispositionType } from './workflow-disposition.model'

export interface IWorkflowinfoData extends Object {
  learnMore: string
  why: string
  what: string | IQrfTemplate | [string, string]
  disposition: WorkflowDispositionType
}
