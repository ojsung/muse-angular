import { IWorkflowinfoData } from './workflow-option-info.model'
import { StepType } from './workflow-step.model'

export interface IWorkflowOption extends Object {
  step: StepType
  label: string
  infoData: IWorkflowinfoData
  options: Array<[string, StepType]>
}
