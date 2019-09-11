import * as React from 'react';
import { observable, IObservableArray, computed, isObservableArray } from 'mobx';
import { VStockInfo } from './VStockInfo'
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';

export class CStockInfo extends CUqBase {
  cApp: CMiApp;
  baseItem: any;
  @observable protected loaded: boolean = false;
  protected _items: IObservableArray<any> = observable.array<any>([], { deep: true });
  @observable allLoaded: boolean = false;
  @computed get items(): IObservableArray<any> {
    if (this.loaded === false) return undefined;
    return this._items;
  }

  /*
  constructor(cApp: CMiApp, res: any) {
    super(res);

    this.cApp = cApp;
    this._items = observable.array<any>([], { deep: true });
  }
  */

  loadData = () => {
    this.loading();
  }

  loading = async () => {
    this.loaded = true;
  }

  async internalStart(param: any) {
    this.baseItem = param;
    this.loadData();
    this.openVPage(VStockInfo);
  }

  openMetaView = () => {
  }

}