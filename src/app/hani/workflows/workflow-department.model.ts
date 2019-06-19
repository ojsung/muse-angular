import { IWorkflowContainer } from './workflow-container.model'

export interface IWorkflowDepartment extends Object {
  department: string
  workflows: Array<IWorkflowContainer>
}
