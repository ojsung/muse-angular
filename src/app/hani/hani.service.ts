import { Injectable, OnDestroy } from '@angular/core'
import { IWorkflowContainer } from './models/workflows/workflow-container.model'
import { StepType } from './models/workflows/workflow-step.model'
import { IWorkflowTrend } from './models/workflow-trend.model'
import { AuthService } from '../user/auth.service'
import { IWorkflowOption } from './models/workflows/workflow-option.model'
import { HttpService } from '../shared/http.service'
import { HttpClient } from '@angular/common/http'
import { IWorkflowDepartment } from './models/workflows/workflow-department.model'
import { tap } from 'rxjs/operators'
import { Subscription } from 'rxjs'

@Injectable()
export class HaniService extends HttpService implements OnDestroy {
  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }

  private departmentList: IWorkflowDepartment[]
  private CPE: object
  private AP: object
  private switch: object
  private commandUrl = 'command'
  private workflowUrl = 'hani'
  public trendingUrl = 'trending'
  private bugUrl = 'bug'
  private trendingSubscription: Subscription
  private workflowComplete: IWorkflowOption = {
    step: ['Q', 0, null],
    label: 'Complete',
    infoData: {
      learnMore: 'Complete',
      why:
        'If you are seeing this, please fill out the bug report and make the note "It failed here". If you customer requires further help, please contact QRF',
      what: {
        'Customer ID': null,
        'Initial Workflow': null,
        'Current Workflow': null,
        'Where you are in the Workflow': null,
        'AP Device Name': null,
        'AP IP': null,
        'CPE MAC': null,
        'CPE IP': null,
        Question:
          'Hani has reached a failpoint, and I have filled out a bugreport.  But my customer is still experiencing issues.'
      },
      disposition: [[0, null], [1, null], [2, null], [3, null], [4, null]],
      autoText: null
    },
    options: [['Complete', ['0', 0, '0']]]
  }

  public get departments() {
    return this.departmentList
  }
  public get completeWorkflow() {
    return this.workflowComplete
  }

  public compareArrays(array1, array2) {
    return (
      array1.length === array2.length && array1.every((value, index) => value === array2[index])
    )
  }

  public gatherWorkflowTrend(
    workflow: IWorkflowContainer,
    step: StepType,
    workflowTrendArray: Array<IWorkflowTrend>
  ) {
    const date = Date.now()
    const workflowName = workflow.workflowName
    workflowTrendArray.push({ workflow: workflowName, step, date })
  }

  public replaceArray(array: [string, string]) {
    let objToSearch: object
    const keyToFind = array[1]
    switch (array[0]) {
      case 'CPE': {
        objToSearch = this.CPE
        break
      }
      case 'AP': {
        objToSearch = this.AP
        break
      }
      case 'switch': {
        objToSearch = this.switch
        break
      }
      default: console.log('Something broke in HaniService.replaceArray()')
  }
    return objToSearch[keyToFind]
  }

  public getCommands() {
    return this.getEntry(this.commandUrl).pipe(
      tap(radio => {
        radio.forEach(device => {
          switch (device.deviceType) {
            case 'cpe': {
              this.CPE = device.commands as object
              break
            }
            case 'ap': {
              this.AP = device.commands as object
              break
            }
            case 'switch': {
              this.switch = device.commands as object
              break
            }
            default: {
              console.log('Something broke in HaniService.getCommands()')
              }
          }
        })
      })
    )
  }

  public getWorkflows() {
    return this.getEntry(this.workflowUrl).pipe(
      tap(departments => {
        this.departmentList = departments
      })
    )
  }

  public postBugs(bugReport: string) {
    const date = Date.now()
    return this.postEntry(this.bugUrl, { bug: bugReport, date })
  }

  public postTracking(workflowTrendArray) {
    return this.postEntry(this.trendingUrl, {
      trending: workflowTrendArray,
      user: { firstName: this.auth.firstName, lastName: this.auth.lastName }
    })
  }

  ngOnDestroy() {
    if (this.trendingSubscription) {
      this.trendingSubscription.unsubscribe()
    }
  }
}
