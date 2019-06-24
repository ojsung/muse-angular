import { StepType } from './workflows/workflow-step.model';

export interface IWorkflowTrend {
  workflow: string
  step: StepType
  date: number
}
