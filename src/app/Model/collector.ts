export class collector{
    constructor(public codeCollector?:number,public nameCollector?:string,public username?:string,public password?:string,public email?:string){};
    toString(){return this.codeCollector+" "+this.nameCollector+" "+this.username+"  "+this.password+"  "+this.email}
}
