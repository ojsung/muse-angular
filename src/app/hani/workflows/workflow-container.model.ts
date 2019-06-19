import { IWorkflowOption } from './workflow-option.model'
import { Step } from './workflow-step.model';

export interface IWorkflowContainer extends Object {
  workflowName: string;
  begin: Step;
  steps: Array<IWorkflowOption>
}
