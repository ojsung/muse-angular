import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { IWorkflowContainer } from './models/workflows/workflow-container.model'
import { IWorkflowOption } from './models/workflows/workflow-option.model'
import { IWorkflowDepartment } from './models/workflows/workflow-department.model'
import { StepType } from './models/workflows/workflow-step.model'
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms'
import { IWorkflowinfoData } from './models/workflows/workflow-option-info.model'
import { IQrfTemplate } from './models/workflows/workflow-qrf-template.model'
import { HaniService } from './hani.service'
import { IWorkflowTrend } from './models/workflow-trend.model'
import { WorkflowDispositionType } from './models/workflows/workflow-disposition.model'
import { Subscription } from 'rxjs'

@Component({
  selector: 'muse-hani',
  templateUrl: './hani.component.html',
  styleUrls: ['./hani.component.css']
})
export class HaniComponent implements OnInit, OnDestroy {
  @Input() name
  constructor(private fb: FormBuilder, public hs: HaniService) {}
  public siForm: FormGroup // static info form
  public currentDepartment: IWorkflowDepartment
  private calledFromWf = false
  public workflowContainersInDepartment: IWorkflowContainer[]
  private chosenWorkflowContainer: IWorkflowContainer
  public currentWorkflow: IWorkflowOption
  public azotelId: number
  public infoData: IWorkflowinfoData
  public currentNav: Array<[[StepType], string, string]> = []
  public pageTitle = 'Hani: The Troubleshooting Assistant'
  public workflowText = 'Begin Discovery'
  private azotelIdControl: AbstractControl
  private apNameControl: AbstractControl
  private apIPControl: AbstractControl
  private cpeMACControl: AbstractControl
  private cpeIPControl: AbstractControl
  private autoboxControl: AbstractControl
  private workflowTrendArray: Array<IWorkflowTrend> = []
  private trackingSubscription: Subscription
  private initialWorkflow: string
  public visibleWorkflowCount = 1
  public showTextBox = false
  public textReport = ''
  public userName = this.hs.auth.firstName
  private get reportToSend() {
    return this.textReport
  }
  private bugReportSubscription: Subscription
  public navOpen = false

  // Depending on what step the T1 is on, infoData may still be undefined.
  // this let's the html know the state of infoData
  public get infoDataDataType() {
    return this.infoData.what instanceof Object
  }

  public get departments(): IWorkflowDepartment[] {
    let departmentList = this.hs.departments
    if (!departmentList) {
      departmentList = this.hs.getWorkflowList()
      this.hs.getCommandList()
    }
    return departmentList
  }

  private get containerLength(): number {
    return this.chosenWorkflowContainer ? this.chosenWorkflowContainer.steps.length : 0
  }

  public get azotelIdEntered(): boolean {
    return !!this.azotelIdControl.value
  }

  // When a T1 needs to send in a QRF, this autofills the QRF with the customer's info
  get jsonInfoDataWhat() {
    let filledOutJson: IQrfTemplate
    let jsonText = ''
    if (this.infoData.what instanceof Object && !(this.infoData.what instanceof Array)) {
      filledOutJson = this.infoData.what
      filledOutJson['Initial Workflow'] = this.initialWorkflow
      filledOutJson['Customer ID'] = this.azotelIdControl.value
      filledOutJson['AP Device Name'] = this.apNameControl.value
      filledOutJson['AP IP'] = this.apIPControl.value
      filledOutJson['CPE MAC'] = this.cpeMACControl.value
      filledOutJson['CPE IP'] = this.cpeIPControl.value
      // turn json into text
      Object.entries(filledOutJson).forEach(entry => {
        jsonText += `${entry[0]} : ${entry[1]}\n`
      })
      return jsonText
    } else {
      return null
    }
  }

  public get introPass(): boolean {
    return this.hs.aws.index === 2 && !this.azotelIdEntered
  }

  ngOnInit() {
    this.checkForWorkflows()
    this.hs.startTime = Date.now()

    // form to hold the static info and notes
    this.siForm = this.fb.group({
      department: '',
      azotelId: [null, [Validators.required, Validators.min(1)]],
      apName: '',
      apIP: '',
      cpeMAC: '',
      cpeIP: '',
      autobox: ''
    })

    this.azotelIdControl = this.siForm.get('azotelId')
    this.apNameControl = this.siForm.get('apName')
    this.apIPControl = this.siForm.get('apIP')
    this.cpeMACControl = this.siForm.get('cpeMAC')
    this.cpeIPControl = this.siForm.get('cpeIP')
    this.autoboxControl = this.siForm.get('autobox')
  }

  ngOnDestroy() {
    // because the subscription is only created if this.departments is empty,
    // it is possible to create and destroy Hani without creating a subscription
    // in cases where no sub was made, there will be nothing to destroy.
    if (this.workflowTrendArray) {
      this.trackingSubscription = this.hs.postTracking(this.workflowTrendArray).subscribe({
        error: error => {
          this.trackingSubscription.unsubscribe()
          console.log(error)
        },
        next: () => {
          this.trackingSubscription.unsubscribe()
        },
        complete: () => {
          this.trackingSubscription.unsubscribe()
        }
      })
    }
    this.hs.aws.resetIndex()
  }

  // check for workflows. If they aren't already downloaded, download them
  private checkForWorkflows() {
    let departmentList = this.hs.departments
    if (!departmentList) {
      departmentList = this.hs.getWorkflowList()
      this.hs.getCommandList()
    }
  }

  // this will only be called once when the user is selecting which department's workflows to see
  public setDepartment(index) {
    this.currentDepartment = this.departments[index]
  }

  // select which workflow to start down
  public selectWorkflow(index) {
    this.workflowContainersInDepartment = this.currentDepartment.workflows
    this.chosenWorkflowContainer = this.workflowContainersInDepartment[index]
    const workflowBegin = this.chosenWorkflowContainer.begin
    this.initialWorkflow = this.chosenWorkflowContainer.workflowName
    this.visibleWorkflowCount = this.currentDepartment.workflows.length
    this.workflowText = 'Choose a Workflow:'
    this.selectNextStep(workflowBegin)
  }

  private get currentDisposition() {
    return this.infoData ? this.infoData.disposition : null
  }

  private selectNextStep(chosenIndexStep: StepType) {
    let matchFound = false

    // We need to save the current disposition codes, in case there is no next step
    const currentDisposition = this.currentDisposition

    // loop through the workflows in the workflow container
    // if a match is found, set that workflow as the current workflow
    // else, set the "complete" workflow as the current workflow
    for (let i = 0; i < this.containerLength; i++) {
      const currentIndexWorkflow = this.chosenWorkflowContainer.steps[i]
      const currentIndexStep = currentIndexWorkflow.step
      if (this.hs.compareArrays(currentIndexStep, chosenIndexStep)) {
        this.currentWorkflow = currentIndexWorkflow
        this.infoData = this.currentWorkflow.infoData
        matchFound = true
        break
      }
    }

    // next, update the trend tracker
    this.hs.gatherWorkflowTrend(
      this.chosenWorkflowContainer,
      this.currentWorkflow.step,
      this.workflowTrendArray,
      this.azotelIdControl.value
    )

    if (this.infoData.what instanceof Array) {
      this.infoData.what = this.hs.replaceArray(this.infoData.what)
    }

    // if the next step wasn't found, it means that the rep has reached the end of the workflow
    // in this case, the workflow we give them is the 'Completed' workflow.  However,
    // we want to make sure they can still look at the dispositions they had last
    if (!matchFound) {
      this.setCompleteWorkflow(currentDisposition)
    }
  }

  // update the Navigation and reset calledFromWf to prep for the next navigation option
  private resetCalledFromWf(
    currentStep: [string, number, string],
    currentLabel: string,
    chosenIndexOptions: any
  ) {
    if (this.calledFromWf) {
      this.currentNav.push([[currentStep], currentLabel, chosenIndexOptions[0]])
      this.calledFromWf = false
    }
  }

  // if no match was found, the user must have completed the workflows
  // in this case, give them the generic completed workflow object
  private setCompleteWorkflow(currentDisposition: WorkflowDispositionType) {
    this.currentWorkflow = this.hs.completeWorkflow
    this.infoData = this.currentWorkflow.infoData
    this.infoData.disposition = currentDisposition
  }

  private setCurrentInfo(currentStep: [string, number, string], currentLabel: string) {
    if (this.currentWorkflow) {
      currentStep = this.currentWorkflow.step
      currentLabel = this.currentWorkflow.label
    }
    return { currentStep, currentLabel }
  }

  private checkSource(index: number, chosenIndexOptions: any) {
    if (Number.isInteger(index)) {
      chosenIndexOptions = this.currentWorkflow.options[index]
      this.calledFromWf = true
    }
    return chosenIndexOptions
  }

  // pushes autotext to autobox
  private updateNotes(notes: string) {
    if (notes) {
      this.autoboxControl.setValue(this.autoboxControl.value + notes)
      this.autoboxControl.updateValueAndValidity()
    }
  }

  public clearDepartmentAndWorkflow() {
    this.initialWorkflow = null
    this.currentDepartment = null
    this.workflowContainersInDepartment = []
    this.clearCurrentWorkflow()
  }

  private clearCurrentWorkflow() {
    this.currentNav = []
    this.currentWorkflow = null
    this.infoData = null
    this.workflowTrendArray = []
  }

  public fullRestart() {
    this.sendToServer()
    this.clearDepartmentAndWorkflow()
    this.siForm.reset()
    this.visibleWorkflowCount = 1
    this.workflowText = 'Begin Discovery'
    this.hs.startTime = Date.now()
    this.hs.aws.resetIndex()
  }

  private sendToServer() {
    this.trackingSubscription = this.hs.postTracking(this.workflowTrendArray).subscribe({
      complete: () => {
        this.trackingSubscription.unsubscribe()
      },
      error: error => {
        this.trackingSubscription.unsubscribe()
        console.log(error)
      }
    })
  }

  // this handles interactions from the template
  // this will be called either once the t1 is already in a workflow
  // or when they choose their first workflow
  public trackAndSelectWorkflow(index?: number, workflowBegin?: StepType) {
    let chosenIndexOptions: any
    chosenIndexOptions = this.checkSource(index, chosenIndexOptions)
    const chosenIndexStep = this.findChosenStep(chosenIndexOptions, index, workflowBegin)
    this.selectNextStep(chosenIndexStep)
  }

  private findChosenStep(chosenIndexOptions: any, index: number, workflowBegin: StepType) {
    // if we're already in the workflows, get the step and label for the workflow we are in.
    // they will be used later to update the navigation history
    let currentStep: StepType
    let currentLabel: string
    let currentAutotext: string
    ;({ currentStep, currentLabel } = this.setCurrentInfo(currentStep, currentLabel))

    // use checkSource to see if we're entering this workflow from another workflow
    // or from the workflow container or nav bar
    // checkSource will return a falsy value if coming from the workflow container or nav bar
    let chosenIndexStep: StepType
    if (chosenIndexOptions) {
      chosenIndexStep = chosenIndexOptions[1]
      currentAutotext = chosenIndexOptions[2] ? chosenIndexOptions[2] : ''
      this.updateNotes(currentAutotext)
    } else {
      chosenIndexStep = workflowBegin
      currentAutotext = ''
    }

    // reset the called from wf tracker.
    this.resetCalledFromWf(currentStep, currentLabel, chosenIndexOptions)

    return chosenIndexStep
  }

  public moveToDifferentFlow(workflowName) {
    const newWorkflow = workflowName
    let workflowFirstStep: StepType
    this.sendToServer()
    this.clearCurrentWorkflow()
    const length = this.workflowContainersInDepartment.length
    for (let i = 0, j = length; i < j; i++) {
      const workflow = this.workflowContainersInDepartment[i]
      if (workflow.workflowName === newWorkflow) {
        this.chosenWorkflowContainer = workflow
        break
      }
    }
    workflowFirstStep = this.chosenWorkflowContainer.begin
    this.selectNextStep(workflowFirstStep)
  }

  public reportProblem(reportType) {
    const currentWfStep = this.currentWorkflow.step
    const report = this.reportToSend
    const fullReport = `${reportType}: ${this.currentNav}, ${currentWfStep} - ${report}`
    this.bugReportSubscription = this.hs.postBugs(fullReport).subscribe(() => {
      this.bugReportSubscription.unsubscribe()
      this.showTextBox = false
      this.textReport = ''
    })
  }

  public openReporting() {
    this.showTextBox = true
  }

  public openNav() {
    this.navOpen = true
  }

  public closeNav() {
    this.navOpen = false
  }
}
