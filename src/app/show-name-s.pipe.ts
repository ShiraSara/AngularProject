import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNameS'
})
export class ShowNameSPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
