/*
import {observable} from 'mobx';
import _ from 'lodash';
import { Entity } from '../entity';
import { Uq, Field, ArrFields, SchemaFrom } from '../uq';
import { CUq, CTuidMain, CTuid, CTuidBase } from '../../controllers';

export class Tuid extends Entity {
    private BoxId: ()=>void;
    get typeName(): string { return 'tuid';}
    idName: string;
    unique: string[];
    schemaFrom: SchemaFrom;

    private buildIdBoxer() {
        if (this.BoxId !== undefined) return;
        this.BoxId = function():void {};
        let prototype = this.BoxId.prototype;
        Object.defineProperty(prototype, '_$tuid', {
            value: this, //.from(),
            writable: false,
            enumerable: false,
        });
        Object.defineProperty(prototype, 'obj', {
            enumerable: false,
            get: function() {
                if (this.id === undefined || this.id<=0) return undefined;
                return this._$tuid.valueFromId(this.id);
            }
        });
        prototype.valueFromFieldName = function(fieldName:string):BoxId|any {
            let t:TuidBase = this._$tuid;
            return t.valueFromFieldName(fieldName, this.obj);
        };
        prototype.getObj = function():any {
            if (this._$tuid !== undefined) {
                return this._$tuid.getCacheValue(this.id);
            }
        };
        prototype.toJSON = function() {return this.id};
    }
    boxId(id:number):BoxId {
        if (typeof id === 'object') return id as any;
        this.useId(id);
        this.buildIdBoxer();
        let ret:BoxId = new this.BoxId();
        ret.id = id;
        return ret;
    }
    getIdFromObj(item:any):number {
        return item[this.idName];
    }

    setSchema(schema:any) {
        super.setSchema(schema);
        let {id, unique} = schema;
        this.idName = id;
        this.unique = unique;
        this.schemaFrom = this.schema.from;
    }
    public buildFieldsTuid() {
        super.buildFieldsTuid();
        let {mainFields} = this.schema;
        if (mainFields !== undefined) {
            for (let mf of mainFields) {
                if (!mf) continue;
                let f = this.fields.find(v => {
                    return v.name === mf.name;
                });
                if (f === undefined) continue;
                mf._tuid = f._tuid;
            }
        }
    }
    valueFromId(id:number|BoxId):any {
        let _id:number;
        switch (typeof id) {
            case 'object': _id = (id as BoxId).id; break;
            case 'number': _id = id as number; break;
            default: return;
        }
        return this.getCacheValue(_id);
    }
    valueFromFieldName(fieldName:string, obj:any):BoxId|any {
        if (obj === undefined) return;
        if (this.fields === undefined) return;
        let f = this.fields.find(v => v.name === fieldName);
        if (f === undefined) return;
        let v = obj[fieldName];
        let {_tuid} = f;
        if (_tuid === undefined) return v;
        return _tuid.valueFromId(v);
    }
    from(): Tuid {return;}
    protected get isFrom():boolean {return this.schemaFrom !== undefined}
    private unpackTuidIds(values:any[]|string):any[] {
        if (this.isFrom === true) {
            let tuidMain = this.from();
            let retFrom = tuidMain.unpackTuidIds(values);
            return retFrom;
        }
        let {mainFields} = this.schema;
        if (mainFields === undefined) return values as any[];
        let ret:any[] = []
        let len = (values as string).length;
        let p = 0;
        while (p<len) {
            let ch = (values as string).charCodeAt(p);
            if (ch === 10) {
                ++p;
                break;
            }
            let row = {};
            p = this.unpackRow(row, mainFields, values as string, p);
            ret.push(row);
        }
        return ret;
    }
    protected async loadTuidIds():Promise<any[]> {
        let api = this.getApiFrom();
        let tuids = await api.tuidIds(this.name, undefined, this.waitingIds);
        return tuids;
    }
    async load(id:number):Promise<any> {
        if (id === undefined || id === 0) return;
        let api = this.getApiFrom();
        let values = await api.tuidGet(this.name, id);
        if (values === undefined) return;
        for (let f of this.schema.fields) {
            let {tuid} = f;
            if (tuid === undefined) continue;
            let t = this.uq.getTuid(tuid);
            if (t === undefined) continue;
            let n = f.name;
            values[n] = t.boxId(values[n]);
        }
        //values._$tuid = this;
        this.cacheValue(values);
        this.cacheTuidFieldValues(values);
        return values;
    }
    getDiv(divName:string):TuidDiv {return;}
    private cacheTuidFieldValues(values:any) {
        let {fields, arrs} = this.schema;
        this.cacheFieldsInValue(values, fields);
        if (arrs !== undefined) {
            for (let arr of arrs as ArrFields[]) {
                let {name, fields} = arr;
                let arrValues = values[name];
                if (arrValues === undefined) continue;
                let tuidDiv = this.getDiv(name);
                for (let row of arrValues) {
                    row._$tuid = tuidDiv;
                    row.$owner = this.boxId(row.owner);
                    tuidDiv.cacheValue(row);
                    this.cacheFieldsInValue(row, fields);
                }
            }
        }
    }
    protected cacheFieldsInValue(values:any, fields:Field[]) {
        for (let f of fields as Field[]) {
            let {name, _tuid} = f;
            if (_tuid === undefined) continue;
            let id = values[name];
            //_tuid.useId(id);
            values[name] = _tuid.boxId(id);
        }
    }



    // cache放到Tuid里面之后，这个函数不再需要公开调用了
    //private async ids(idArr:number[]) {
    //    return await this.tvApi.tuidIds(this.name, idArr);
    //}
    abstract async showInfo(id:number);
    abstract getTuidContent():any;
}

export class Tuid extends TuidBase {
    private cTuid: CTuid<Tuid>;
    get main() {return this}
    get uqApi() {return this.uq.uqApi};

    divs: {[name:string]: TuidDiv};

    setCTuid(cTuid: CTuid<Tuid>) {
        this.cTuid = cTuid;
    }

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {arrs} = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let {name} = arr;
                let tuidDiv = new TuidDiv(this.uq, this, name, this.typeId);
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
            }
        }
    }
    getDiv(divName:string):TuidDiv {return this.divs[divName];}
    // 努力回避async里面的super调用，edge不兼容
    //async cacheIds():Promise<void> {
    //    await super.cacheIds();
    //    if (this.divs === undefined) return;
    //    for (let i in this.divs) {
    //        await this.divs[i].cacheIds();
    //    }
    //}
    //
    protected async cacheDivIds():Promise<void> {
        if (this.divs === undefined) return;
        for (let i in this.divs) {
            await this.divs[i].cacheIds();
        }
    }

    cUqFrom(): CUq {
        if (this.schemaFrom === undefined) return this.uq.uqApp;
        let {owner, uq} = this.schemaFrom;
        let cUq = this.uq.uqApp;
        let cApp = cUq.cApp;
        if (cApp === undefined) return cUq;
        let cUqFrm = cApp.getImportUq(owner, uq);
        if (cUqFrm === undefined) {
            console.error(`${owner}/${uq} 不存在`);
            debugger;
            return cUq;
        }
        //
        //let retErrors = await cUqFrm.loadSchema();
        //if (retErrors !== undefined) {
        //    console.error('cUq.loadSchema: ' + retErrors);
        //    debugger;
        //    return cUq;
        //}
        return cUqFrm;
    }

    getApiFrom() {
        let from = this.from();
        if (from !== undefined) {
            return from.uq.uqApi;
        }
        return this.uq.uqApi;
    }

    from(): TuidFrom {
        if (this.schemaFrom === undefined) return this;
        let cUq = this.cUqFrom();
        return cUq.tuid(this.name);
    }

    cFrom(): CTuidMain {
        let cUq = this.cUqFrom();
        return cUq.cTuidMainFromName(this.name);
    }

    async showInfo(id:number) {
        await this.uq.uqApp.showTuid(this, id);
    }
    getTuidContent() {
        return this.uq.uqApp.getTuidContent(this);
    }
}

export class TuidFrom extends Tuid {
}

export class TuidDiv extends TuidBase {
    private cTuidDiv: CTuidBase;
    owner: Tuid;                    // 用这个值来区分是不是TuidArr
    constructor(entities:Uq, owner:Tuid, name:string, typeId:number) {
        super(entities, name, typeId);
        this.owner = owner;
    }

    setCTuid(cTuid: CTuidBase) {
        this.cTuidDiv = cTuid;
    }

    protected get isFrom():boolean {return this.owner.schemaFrom !== undefined}
    getApiFrom() {
        return this.owner.getApiFrom();
    }
    getCacheValue(id:number) {
        let v = this.cache.get(id);
        console.log('tuiddiv getCacheValue ' + this.name, v);
        if (this.owner !== undefined && typeof v === 'object') {
            v.$owner = this.owner.boxId(v.owner); // this.owner.valueFromId(v.owner);
        }
        return v;
    }
    protected async loadTuidIds():Promise<any[]> {
        let api = this.getApiFrom();
        let tuids = await api.tuidIds(this.owner.name, this.name, this.waitingIds);
        return tuids;
    }
    async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let {fields} = this.schema;
        let name:string, arr:string;
        if (this.owner !== undefined) {
            name = this.owner.name;
            arr = this.name;
        }
        else {
            name = this.name;
            arr = undefined;
        }
        let api = this.getApiFrom();
        let ret = await api.tuidSearch(name, arr, owner, key, pageStart, pageSize);
        for (let row of ret) {
            this.cacheFieldsInValue(row, fields);
            if (this.owner !== undefined) row.$owner = this.owner.boxId(row.owner);
        }
        return ret;
    }
    async showInfo(id:number) {
        await this.cTuidDiv.showTuidDiv(this, id);
    }
    getTuidContent():any {
        return this.cTuidDiv.getContent(this); //uq.uqApp.getTuidDivContent(this);
    }
}
*/