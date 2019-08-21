import { Injectable } from '@angular/core'
import { IWorkflowOption } from './models/workflows/workflow-option.model'

@Injectable({
  providedIn: 'root'
})
export class AuxiliaryWorkflowsService {
  constructor() { }
  private _index = 0
  public get index() {
    return this._index
  }
  public workflowComplete: IWorkflowOption = {
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
      disposition: [[0, null], [1, null], [2, null], [3, null], [4, null]]
    },
    options: [['Complete', ['0', 0, '0'], '']]
  }

  public workflowIntro = {
    0: {
      step: ['S', 1, 'intro'],
      label: 'Open the call',
      infoData: {
        learnMore: 'http://10.252.245.76/vardoc/drupal-project/web/node/34',
        why: 'The first moments of the call set a strong flow for the remainder of the call.',
        what:
          '"Thank you for calling Vivint Internet, this is (your name).  With whom am I speaking?"',
        disposition: [[0, null], [1, null], [2, null], [3, null], [4, null]]
      },
      options: [['Move on', ['S', 2, 'intro'], '']]
    },
    1: {
      step: ['S', 2, 'intro'],
      label: 'Verify the account',
      infoData: {
        learnMore: null,
        why: 'In order to assist the customer, we must first verify the account',
        what:
          '"Can I get the full address on the account including the city, state, and zip code?"',
        disposition: [[0, null], [1, null], [2, null], [3, null], [4, null]]
      },
      options: [['Move on', ['Q', 1, 'intro'], '']]
    },
    2: {
      step: ['Q', 1, 'intro'],
      label: 'Enter the Azotel ID',
      infoData: {
        learnMore: 'Continue',
        why: '',
        what: 'Enter the Azotel ID in the right-hand bar',
        disposition: [[0, 'Troubleshooting'], [1, null], [2, null], [3, null], [4, null]]
      },
      options: [['Discovery', null]]
    }
  }

  public incrementIndex(): void {
    ++this._index
  }
  public resetIndex(): void {
    this._index = 0
  }
}
