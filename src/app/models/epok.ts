export class epok {
    typ: number;               
    max: number;
    min: number;
    text: string

    constructor(data: any) {
        data = data || {};
        this.typ = data.typ;
        this.max = data.max;
        this.min = data.min;
        this.text= data.text;       
    }
}
