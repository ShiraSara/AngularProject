import * as moment from 'moment';
import { promise } from 'protractor';
import { async } from '@angular/core/testing';
export {}
declare global {
    function sleep(ms:number): Promise<never>;
    interface Array<T> {
        distinct(key?: keyof T): Array<T>;
        sortBy(key: keyof T, desc?: boolean): void
        groupBy(key: keyof T):Map<keyof T, T[]>
        groupBy(key: (T)=>any):Map<keyof T, T[]>
        pushArray(arr:T[]): number
        last() :T
    }

    interface Date {
        format(format: string):string
    }

}

declare namespace DataTables {
    interface ColumnMethod {
        title(html?: string): string;
    }
}

Array.prototype.distinct = function (key) {
    let newArr = [];
    if(key) this.forEach(x => { if (!newArr.some(y=>y[key] == x[key])) newArr.push(x); });
    else this.forEach(x => { if (!newArr.includes(x)) newArr.push(x); });
    return newArr;
}

Array.prototype.sortBy = function(key, desc = false) {
    const dir = desc ? -1 : 1;
    this.sort((a,b) => {
        if (!isNaN(+a[key]) && !isNaN(+b[key]))
            return (+a[key] - +b[key]) * dir; 
        return a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0
    });
}

Array.prototype.groupBy = function(keyOrKeyGetter) {
    const map = new Map();
    this.forEach((item) => {
         const key = typeof keyOrKeyGetter == 'function' ? keyOrKeyGetter(item) : item[keyOrKeyGetter];
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

Array.prototype.pushArray = function(arr) {
    for (var i = 0, len = arr.length; i < len; ++i) {
        this.push(arr[i]);
    }
    return this.length
};

Array.prototype.last = function(){
    return this[this.length - 1];
}

Date.prototype.format = function(format:string){
    return moment(this).format(format);
};

(window as any).sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

