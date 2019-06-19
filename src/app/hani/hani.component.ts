import { Component, OnInit } from '@angular/core'
import { HaniHttpService } from './hani-http.service'
import { Subscription } from 'rxjs'
import { IWorkflowContainer } from './workflows/workflow-container.model'
import { IWorkflowOption } from './workflows/workflow-option.model'
import { IWorkflowDepartment } from './workflows/workflow-department.model'
import { Step } from './workflows/workflow-step.model'
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms'

// remove when no longer needed
import { cpeCommandList } from '../../assets/workflow-cpe-command-list'
import { apCommandList } from '../../assets/workflow-ap-command-list'
import { IWorkflowinfoData } from './workflows/workflow-option-info.model'
import { QrfTemplate } from './workflows/workflow-qrf-template.model';

@Component({
  selector: 'cher-hani',
  templateUrl: './hani.component.html',
  styleUrls: ['./hani.component.css']
})
export class HaniComponent implements OnInit {
  constructor(private http: HaniHttpService, private fb: FormBuilder) {}
  public siForm: FormGroup // static info form
  public optionsForm: FormGroup // form to handle options and input
  private CPE = cpeCommandList
  private AP = apCommandList
  public departments: IWorkflowDepartment[]
  public currentDepartment: IWorkflowDepartment
  private workflowUrl: 'hani'
  private subscription: Subscription
  private calledFromWf = false
  public workflowContainersInDepartment: IWorkflowContainer[]
  private chosenWorkflowContainer: IWorkflowContainer
  public currentWorkflow: IWorkflowOption
  private currentWfOption: IWorkflowOption
  public azotelId: string
  public infoData: IWorkflowinfoData
  public currentNav: Array<Array<string>> = []
  public pageTitle = 'Hani: The Troubleshooting Helper'
  private containerLength: number
  private azotelIdControl: AbstractControl
  private apNameControl: AbstractControl
  private apIPControl: AbstractControl
  private cpeMACControl: AbstractControl
  private cpeIPControl: AbstractControl
  private notesControl: AbstractControl
  private workflowComplete: IWorkflowOption = {
    step: [null, null, null],
    label: 'Complete',
    infoData: null,
    options: null
  }

  get infoDataDataType() {
    return this.infoData.what instanceof Object
  }

  get jsonInfoDataWhat() {
    const regex = /","/gi
    let filledOutJson: QrfTemplate
    if (this.infoData.what instanceof Object) {
    filledOutJson = this.infoData.what
    filledOutJson['Customer ID'] = this.azotelIdControl.value
    filledOutJson['AP Device Name'] = this.apNameControl.value
    filledOutJson['AP IP'] = this.apIPControl.value
    filledOutJson['CPE MAC'] = this.cpeMACControl.value
    filledOutJson['CPE IP'] = this.cpeIPControl.value
    return Object.entries(this.infoData.what)
    } else { return null }
  }

  public optionsControl: AbstractControl

  ngOnInit() {
    // form to hold the static info
    this.siForm = this.fb.group({
      department: '',
      azotelId: '',
      apName: '',
      apIP: '',
      cpeMAC: '',
      cpeIP: '',
      notes: ''
    })

    this.azotelIdControl = this.siForm.get('azotelId')
    this.apNameControl = this.siForm.get('apName')
    this.apIPControl = this.siForm.get('apIP')
    this.cpeMACControl = this.siForm.get('cpeMAC')
    this.cpeIPControl = this.siForm.get('cpeIP')
    this.notesControl = this.siForm.get('notes')

    this.optionsForm = this.fb.group({
      options: ['', [Validators.required]],
      autobox: ''
    })

    this.optionsControl = this.optionsForm.get('options')

    this.departments = [
      {
        department: 'Troubleshooting',
        workflows: [
          {
            workflowName: 'Gather Stats Workflow',
            begin: ['Q', 1, null],
            steps: [
              {
                step: ['Q', 1, null],
                label: 'Is this a tumbler issue?',
                infoData: {
                  learnMore: 'Link for tumbler page in wiki',
                  why:
                    'We check to see if this is a recurring issue to identify the severity of the issue',
                  what: 'Check in Salesforce for any recent cases (within the last 4 months)',
                  disposition: [[0, 'Troubleshooting'], [1, null], [2, null], [3, null], [4, null]],
                  autoText: null
                },
                options: [['Yes', [null, 1, null]], ['No', [null, 2, null]]]
              },
              {
                step: [null, 1, null],
                label: 'Initiate a chat with QRF to help with the tumber, then continue',
                infoData: {
                  learnMore: 'Link for QRF',
                  why:
                    'At this point, we need to find whether the issue needs to be immediately escalated, or if there are underlying issues that need to be resolved first.',
                  what: {
                    'Customer ID': 0,
                    Workflow: 'Gather Stats Workflow',
                    'Where you are in the Workflow': '1',
                    'AP Device Name': null,
                    'AP IP': null,
                    'CPE MAC': null,
                    'CPE IP': null,
                    Question:
                      "Looking through this customer's account, I found that this customer has recent, previous cases on their account. They may be considered a tumbler. I notified QRF and continued troubleshooting.  "
                  },
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, null],
                    [3, null],
                    [4, null]
                  ],
                  autoText:
                    'they had called in within the last three months.  I contacted QRF to ask how to proceed.  QRF said '
                },
                options: [['Move on', [null, 2, null]]]
              },
              {
                step: [null, 2, null],
                label: 'Check the hardware ID in WCore',
                infoData: {
                  learnMore: 'link to CPE types',
                  why:
                    "There are three types of CPEs.  While there are uses for 1410s in situations of LoS, we can see firmware issues with them.  We prefer to install 1420 radios on a customer's home.",
                  what: this.CPE['get_bootval vivint_hw_id'],
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, null],
                    [3, null],
                    [4, null]
                  ],
                  autoText: "Looking in the CPE's stats, I found the customer had a"
                },
                options: [['1410/1411', ['R', 1, null]], ['1420', [null, 3, null]]]
              },
              {
                step: ['R', 1, null],
                label: 'Request a tech from QRF to replace the 1410/1411',
                infoData: {
                  learnMore: null,
                  why: 'We are making a push to replace 1410/1411 radios in the field',
                  what: {
                    'Customer ID': 0,
                    Workflow: 'Gather Stats Workflow',
                    'Where you are in the Workflow': 'R1',
                    'AP Device Name': null,
                    'AP IP': null,
                    'CPE MAC': null,
                    'CPE IP': null,
                    Question:
                      'Customer has a 1410/1411 radio.  Can we send a technician to replace it?'
                  },
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, 'Firmware-CPE'],
                    [3, 'Out-of-date'],
                    [4, 'Service call']
                  ],
                  autoText: 'n outdated radio.  I spoke with QRF to replace the radio. '
                },
                options: [['Move on', [null, 3, null]]]
              },
              {
                step: [null, 3, null],
                label: 'Check the association table in the AP',
                infoData: {
                  learnMore: 'link to info about the command',
                  why: "explanation of why we're doing this",
                  what: this.AP.show_assoc_table,
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, 'Poor Signal'],
                    [3, null],
                    [4, null]
                  ],
                  autoText: "I checked the customer's AP's association table."
                },
                options: [['Move on', ['Q', 2, null]]]
              },
              {
                step: ['Q', 2, null],
                label: "Is the Customer's CPE associated?",
                infoData: {
                  learnMore: 'http://10.252.245.76/vardoc/drupal-project/web/node/174',
                  why:
                    'A common cause of "No Internet" issues is a disconnection of the CPE from the AP.',
                  what: this.AP.show_assoc_table,
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, 'Radio Errors'],
                    [3, 'Disassociations'],
                    [4, 'CPE fix']
                  ],
                  autoText: "  Checking the AP, I found that the customer's CPE "
                },
                options: [['Move on', [null, 4, null]]]
              },
              {
                step: [null, 4, null],
                label: 'Check the "RSSI" of the customer\'s CPE from the AP',
                infoData: {
                  learnMore: 'Link to RSSI',
                  why: 'explanation of why we look at the RSSI',
                  what: this.AP.show_assoc_table,
                  disposition: [
                    [0, 'Troubleshooting'],
                    [1, 'CPE'],
                    [2, 'Poor Signal'],
                    [3, 'Poor RSSI'],
                    [4, 'Service Call']
                  ],
                  autoText: "I found that the customer's radio was associated, "
                },
                options: [['Move on', ['Q', 1, 'c']]]
              }
            ]
          },
          {
            workflowName: 'A bill bill Billing',
            begin: ['Q', 1, null],
            steps: [
              {
                step: ['Q', 1, null],
                label: 'Is this a tumbler issue?',
                infoData: {
                  learnMore: 'Link for tumbler page in wiki',
                  why:
                    'We check to see if this is a recurring issue to identify the severity of the issue',
                  what: 'Check in Salesforce for any recent cases (within the last 4 months)',
                  disposition: [[0, 'Troubleshooting'], [1, null], [2, null], [3, null], [4, null]],
                  autoText: null
                },
                options: [['Yes', [null, 1, null]], ['No', [null, 2, null]]]
              }
            ]
          }
        ]
      },
      {
        department: 'Billing',
        workflows: [
          {
            workflowName: 'le Billing',
            begin: ['Q', 1, null],
            steps: [
              {
                step: ['Q', 1, null],
                label: 'Is this a tumbler issue?',
                infoData: {
                  learnMore: 'Link for tumbler page in wiki',
                  why:
                    'We check to see if this is a recurring issue to identify the severity of the issue',
                  what: 'Check in Salesforce for any recent cases (within the last 4 months)',
                  disposition: [[0, 'Troubleshooting'], [1, null], [2, null], [3, null], [4, null]],
                  autoText: null
                },
                options: [['Yes', [null, 1, null]], ['No', [null, 2, null]]]
              }
            ]
          }
        ]
      }
    ]
    // this.subscription = this.http.getEntry(this.workflowUrl).subscribe(workflow => {
    //   this.workflows = workflow
    // })
  }

  selectWorkflow(index) {
    this.workflowContainersInDepartment = this.currentDepartment.workflows
    this.chosenWorkflowContainer = this.workflowContainersInDepartment[index]
    const workflowBegin = this.chosenWorkflowContainer.begin
    this.containerLength = this.chosenWorkflowContainer.steps.length
    this.selectNextStep(null, workflowBegin)
  }

  selectNextStep(index?: number, workflowBegin?: Step) {
    let chosenIndexStep: Step
    let chosenIndexOptions: any
    const currentLabel = this.currentWfOption ? this.currentWfOption.label : null
    chosenIndexOptions = this.checkSource(index, chosenIndexOptions)
    chosenIndexStep = chosenIndexOptions ? chosenIndexOptions[1] : workflowBegin
    for (let i = 0; i < this.containerLength; i++) {
      const currentIndexWorkflow = this.chosenWorkflowContainer.steps[i]
      const currentIndexStep = currentIndexWorkflow.step
      if (this.compareArrays(currentIndexStep, chosenIndexStep)) {
        this.currentWorkflow = currentIndexWorkflow
        this.infoData = this.currentWorkflow.infoData
        break
      }
    }
    if (this.calledFromWf) {
      this.currentNav.push([currentLabel, chosenIndexOptions[0]])
    }
  }

  private checkSource(index: number, chosenIndexOptions: any,) {
    if (Number.isInteger(index)) {
      chosenIndexOptions = this.currentWorkflow.options[index]
      this.calledFromWf = true
    }
    return chosenIndexOptions
  }

  setDepartment(index) {
    this.currentDepartment = this.departments[index]
  }

  compareArrays(array1, array2) {
    return (
      array1.length === array2.length && array1.every((value, index) => value === array2[index])
    )
  }
}
