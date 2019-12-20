export class Global{
    public  oustanding_InvoiceMAWB:boolean = false;

    setoustanding_InvoiceMAWB(value: boolean){
    	console.log("setting "+value);
    	this.oustanding_InvoiceMAWB = value;
    }

    getoustanding_InvoiceMAWB(){
    	console.log(this.oustanding_InvoiceMAWB);
    	return this.oustanding_InvoiceMAWB;

    }
}