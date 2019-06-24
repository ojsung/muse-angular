import { IWorkflowContainer } from './workflow-container.model'

export interface IWorkflowDepartment extends Object {
  _id?: string
  department: string
  workflows: Array<IWorkflowContainer>
}
