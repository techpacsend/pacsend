import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byPassSecurityScript'
})
export class ByPassSecurityScriptPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform (value: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
