import { DatePipe } from "@angular/common";

export class EvaDatePipe extends DatePipe {
  public transform(value): any {
    return super.transform(value, 'medium')
  }
}