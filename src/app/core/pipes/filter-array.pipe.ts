import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(value: any[], keyword: string): any[] {
    if (!keyword) {
      return value;
    }
    return value.filter((x: any) => x.user.name.toLowerCase().includes(keyword.toLocaleLowerCase()));
  }

}
