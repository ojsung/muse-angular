import { IWorkflowOption } from './workflow-option.model'
import { StepType } from './workflow-step.model';

export interface IWorkflowContainer extends Object {
  workflowName: string;
  begin: StepType;
  steps: Array<IWorkflowOption>
}
