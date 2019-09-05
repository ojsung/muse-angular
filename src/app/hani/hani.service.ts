import { Injectable, OnDestroy, OnInit } from '@angular/core'
import { IWorkflowContainer } from './models/workflows/workflow-container.model'
import { StepType } from './models/workflows/workflow-step.model'
import { IWorkflowTrend } from './models/workflow-trend.model'
import { AuthService } from '../user/auth.service'
import { HttpService } from '../shared/http.service'
import { HttpClient } from '@angular/common/http'
import { IWorkflowDepartment } from './models/workflows/workflow-department.model'
import { tap } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { AuxiliaryWorkflowsService } from './auxiliary-workflows.service'

@Injectable()
export class HaniService extends HttpService implements OnInit, OnDestroy {
  constructor(protected http: HttpClient, public auth: AuthService, public aws: AuxiliaryWorkflowsService) {
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
  private commandSubscription: Subscription
  private workflowSubscription: Subscription
  public startTime: number
  public endTime: number

  public get departments() {
    return this.departmentList
  }

  public set departments(departments) {
    if (departments) {
      this.departmentList = departments
    }
  }

  public completeWorkflow = this.aws.workflowComplete
  public introWorkflow = this.aws.workflowIntro

  public compareArrays(array1, array2) {
    return (
      array1.length === array2.length && array1.every((value, index) => value === array2[index])
    )
  }

  public gatherWorkflowTrend(
    workflow: IWorkflowContainer,
    step: StepType,
    workflowTrendArray: Array<IWorkflowTrend>,
    azotelId,
  ) {
    if (step && workflow && workflowTrendArray) {
      const date = Date.now()
      const workflowName = workflow.workflowName
      workflowTrendArray.push({ workflow: workflowName, step, date, azotelId })
    }
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
      default:
        console.log('Something broke in HaniService.replaceArray()')
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

  public getWorkflowList(): IWorkflowDepartment[] {
    const departmentList: IWorkflowDepartment[] = [{department: 'Troubleshooting', workflows: null}]
    this.workflowSubscription = this.getWorkflows().subscribe({
      error: error => {
        console.log(error)
        this.unsubscribeFrom(this.workflowSubscription)
      },
      next: workflows => {
        departmentList[0].workflows = workflows
        this.unsubscribeFrom(this.workflowSubscription)
        this.departments = departmentList as IWorkflowDepartment[]
      }
    })
    return departmentList
  }

  getCommandList() {
    this.commandSubscription = this.getCommands().subscribe({
      next: () => {},
      complete: () => this.unsubscribeFrom(this.commandSubscription),
      error: error => {
        this.unsubscribeFrom(this.commandSubscription)
        console.log(error)
      }
    })
  }

  public getWorkflows() {
    return this.getEntry(this.workflowUrl)
  }

  public postBugs(bugReport: string) {
    const date = Date.now()
    return this.postEntry(this.bugUrl, { bug: bugReport, date })
  }

  public postTracking(workflowTrendArray) {
    this.endTime = Date.now()
    return this.postEntry(this.trendingUrl, {
      trending: workflowTrendArray,
      user: { firstName: this.auth.firstName, lastName: this.auth.lastName },
      timeId: this.startTime,
      endTimeId: this.endTime
    })
  }

  public unsubscribeFrom(subscription: Subscription) {
    subscription.unsubscribe()
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.trendingSubscription) {
      this.trendingSubscription.unsubscribe()
    }
  }
}
