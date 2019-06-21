import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { HaniHttpService } from './hani-http.service'
import { Subscription } from 'rxjs'
import { IWorkflowContainer } from './workflows/workflow-container.model'
import { IWorkflowOption } from './workflows/workflow-option.model'
import { IWorkflowDepartment } from './workflows/workflow-department.model'
import { Step } from './workflows/workflow-step.model'
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms'
import { IWorkflowinfoData } from './workflows/workflow-option-info.model'
import { QrfTemplate } from './workflows/workflow-qrf-template.model'
import { HaniService } from './hani.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cher-hani',
  templateUrl: './hani.component.html',
  styleUrls: ['./hani.component.css']
})
export class HaniComponent implements OnInit, OnDestroy {
  @Input() name
  constructor(private http: HaniHttpService, private fb: FormBuilder, private hs: HaniService, public activeModal: NgbActiveModal) {}
  public siForm: FormGroup // static info form
  public optionsForm: FormGroup // form to handle options and input
  private CPE
  private AP
  public departments: IWorkflowDepartment[]
  public currentDepartment: IWorkflowDepartment
  private workflowUrl = 'hani'
  private commandUrl = 'command'
  private workflowSubscription: Subscription
  private commandsSubscription: Subscription
  private calledFromWf = false
  public workflowContainersInDepartment: IWorkflowContainer[]
  private chosenWorkflowContainer: IWorkflowContainer
  public currentWorkflow: IWorkflowOption
  public azotelId: string
  public infoData: IWorkflowinfoData
  public currentNav: Array<[[Step], string, string]> = []
  public pageTitle = 'Hani: The Troubleshooting Assistant'
  private containerLength: number
  private azotelIdControl: AbstractControl
  private apNameControl: AbstractControl
  private apIPControl: AbstractControl
  private cpeMACControl: AbstractControl
  private cpeIPControl: AbstractControl
  private autoboxControl: AbstractControl
  private workflowComplete: IWorkflowOption = {
    step: ['Q', 0, null],
    label: 'Complete',
    infoData: {
      learnMore: 'Complete',
      why:
        'You have completed this workflow. If you are still experiencing issues, please contact QRF',
      what: {
        'Customer ID': null,
        Workflow: null,
        'Where you are in the Workflow': null,
        'AP Device Name': null,
        'AP IP': null,
        'CPE MAC': null,
        'CPE IP': null,
        Question:
          'I have completed the current workflow, but my customer is still experiencing issues.'
      },
      disposition: [[0, null], [1, null], [2, null], [3, null], [4, null]],
      autoText: null
    },
    options: [['Complete', ['0', 0, '0']]]
  }

  get infoDataDataType() {
    return this.infoData.what instanceof Object
  }

  get jsonInfoDataWhat() {
    let filledOutJson: QrfTemplate
    if (this.infoData.what instanceof Object && !(this.infoData.what instanceof Array)) {
      filledOutJson = this.infoData.what
      filledOutJson['Customer ID'] = this.azotelIdControl.value
      filledOutJson['AP Device Name'] = this.apNameControl.value
      filledOutJson['AP IP'] = this.apIPControl.value
      filledOutJson['CPE MAC'] = this.cpeMACControl.value
      filledOutJson['CPE IP'] = this.cpeIPControl.value
      return Object.entries(filledOutJson)
    } else {
      return null
    }
  }

  ngOnInit() {
    // form to hold the static info and notes
    this.siForm = this.fb.group({
      department: '',
      azotelId: '',
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

    this.workflowSubscription = this.http.getEntry(this.workflowUrl).subscribe(departments => {
      this.departments = departments
    })
    this.commandsSubscription = this.http.getEntry(this.commandUrl).subscribe(radio => {
      radio.forEach(device => {
        if (device.deviceType === 'cpe') {
          this.CPE = device.commands
        } else {
          this.AP = device.commands
        }
      })
    })
  }

  ngOnDestroy() {
    this.workflowSubscription.unsubscribe()
    this.commandsSubscription.unsubscribe()
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
    this.containerLength = this.chosenWorkflowContainer.steps.length
    this.selectNextStep(null, workflowBegin)
  }

  public selectNextStep(index?: number, workflowBegin?: Step) {
    // start by updating the notes in the autobox
    this.updateNotes()

    // if we're already in the workflows, get the step and label for the workflow we are in.
    // they will be used later to update the navigation history
    let currentStep: Step
    let currentLabel: string
    ;({ currentStep, currentLabel } = this.setCurrentInfo(currentStep, currentLabel))

    // use checkSource to see if we're entering this workflow from another workflow
    // or from the workflow container or nav bar
    // checkSource will return a falsy value if coming from the workflow container or nav bar
    let chosenIndexStep: Step
    let chosenIndexOptions: any
    let matchFound = false
    chosenIndexOptions = this.checkSource(index, chosenIndexOptions)
    chosenIndexStep = chosenIndexOptions ? chosenIndexOptions[1] : workflowBegin

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

    if (this.infoData.what instanceof Array) {
      this.infoData.what = this.replaceArray(this.infoData.what)
    }

    this.setCompleteWorkflow(matchFound)

    // reset the called from wf tracker.
    this.resetCalledFromWf(currentStep, currentLabel, chosenIndexOptions)
  }

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

  private setCompleteWorkflow(matchFound: boolean) {
    if (!matchFound) {
      this.currentWorkflow = this.workflowComplete
      this.infoData = this.workflowComplete.infoData
    }
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

  private updateNotes() {
    if (this.infoData && this.infoData.autoText) {
      this.autoboxControl.setValue(
        this.autoboxControl.value + this.currentWorkflow.infoData.autoText
      )
    }
    this.autoboxControl.updateValueAndValidity()
  }

  private replaceArray(array: [string, string]) {
    const objToSearch = array[0] === 'CPE' ? this.CPE : this.AP
    const keyToFind = array[1]
    return objToSearch[keyToFind]
  }

  public restart() {
    this.currentDepartment = null
    this.currentNav = []
    this.currentWorkflow = null
    this.workflowContainersInDepartment = []
    this.infoData = null
    this.siForm.reset()
  }
}
