import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatdates',
  pure: false
})
export class FormatdatesPipe implements PipeTransform {

  transform(value: any): any {
    if (value != null && value != undefined) {
      let checkDate = moment(value, "dd-MMM-yy").isValid();
      if (
        value.toLowerCase() == "sunday" ||
        value.toLowerCase() == "monday" ||
        value.toLowerCase() == "tuesday" ||
        value.toLowerCase() == "wednesday" ||
        value.toLowerCase() == "thursday" ||
        value.toLowerCase() == "friday" ||
        value.toLowerCase() == "saturday" ||
        !checkDate
      ) {
        return value;
      } else {
        let pip = new DatePipe("en-US");
        let date = pip.transform(value, "dd-MMM-yy");
        return date;
      }
    }
  }
}
