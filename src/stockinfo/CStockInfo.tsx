import * as React from 'react';
import { observable, IObservableArray, computed, isObservableArray } from 'mobx';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { VStockInfo } from './VStockInfo'
import { BaseStockInfo } from './StockInfoType';

export class CStockInfo extends CUqBase {
  readonly cApp: CMiApp;
  baseItem: BaseStockInfo;
  @observable protected loaded: boolean = false;
  protected _items: IObservableArray<any> = observable.array<any>([], { deep: true });
  @observable allLoaded: boolean = false;
  @computed get items(): IObservableArray<any> {
    if (this.loaded === false) return undefined;
    return this._items;
  }

  loadData = () => {
    this.loading();
  }

  loading = async () => {
    if (!this.baseItem)
      return;
    let { id } = this.baseItem;
    let ret = await this.cApp.miApi.query('q_stockallinfo', [id]);
    if (Array.isArray(ret)) {
      if (this._items.length > 0) {
        this._items.clear();
      }
      this._items.push(...ret);
    }

    this.loaded = true;
  }

  async internalStart(param: any) {
    this.baseItem = param as BaseStockInfo;
    this.loadData();
    this.openVPage(VStockInfo);
  }

  openMetaView = () => {
  }

}