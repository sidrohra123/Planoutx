import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlSlug'
})
export class UrlSlugPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'')
    ;
  }

}
