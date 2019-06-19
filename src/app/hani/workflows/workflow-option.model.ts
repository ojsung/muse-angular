import { IWorkflowinfoData } from './workflow-option-info.model'
import { Step } from './workflow-step.model'

export interface IWorkflowOption extends Object {
  step: Step
  label: string
  infoData: IWorkflowinfoData
  options: Array<[string, Step]>
}
