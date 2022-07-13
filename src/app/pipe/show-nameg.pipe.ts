import { Pipe, PipeTransform } from '@angular/core';
import { storage } from '../Model/storage';
import { StorageService } from '../service/storage.service';

@Pipe({
  name: 'showNameg'
})
export class ShowNamegPipe implements PipeTransform {
  constructor(private serviceStorage:StorageService){}

  storage:storage[];
  transform(value: number, ...args: unknown[]): unknown {
    this.storage=this.serviceStorage.storages;
    debugger
for(let i=0; i<this.storage.length;i++)
{
  debugger
  if(this.storage[i].codeStorage==value)
  return this.storage[i].nameStorage;
}
    return null;
  }

}
