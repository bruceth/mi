import * as React from 'react';
import { observable, IObservableArray, computed, isObservableArray } from 'mobx';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockEarning, StockRoe, StockCapitalearning, StockBonus, StockDivideInfo } from './StockInfoType';

export class CStockInfo extends CUqBase {
  readonly cApp: CMiApp;
  baseItem: NStockInfo;
  @observable protected loaded: boolean = false;

  @observable price : StockPrice;
  @observable roe: StockRoe;
  protected _earning: IObservableArray<StockEarning> = observable.array<StockEarning>([], { deep: true});
  protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true});
  protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true});
  protected _divideInfo: IObservableArray<StockDivideInfo> = observable.array<StockDivideInfo>([], { deep: true});
  
  @computed get earning(): IObservableArray<StockEarning> {
    if (this.loaded === false) return undefined;
    return this._earning;
  }

  @computed get capitalearning(): IObservableArray<StockCapitalearning> {
    if (this.loaded === false) return undefined;
    return this._capitalearning;
  }

  @computed get bonus(): IObservableArray<StockBonus> {
    if (this.loaded === false) return undefined;
    return this._bonus;
  }

  @computed get divideInfo(): IObservableArray<StockDivideInfo> {
    if (this.loaded === false) return undefined;
    return this._divideInfo;
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
      let arr1 = ret[1];
      if (Array.isArray(arr1)) {
        this.price = arr1[0];
      }

      let arr2 = ret[2];
      if (Array.isArray(arr2)) {
        this.roe = arr2[0];
      }

      if (this._earning.length > 0) {
        this._earning.clear();
      }
      let arr3 = ret[3];
      if (Array.isArray(arr3)) {
        this._earning.push(...arr3);
      }

      if (this._capitalearning.length > 0) {
        this._capitalearning.clear();
      }
      let arr4 = ret[4];
      if (Array.isArray(arr4)) {
        this._capitalearning.push(...arr4);
      }

      if (this._bonus.length > 0) {
        this._bonus.clear();
      }
      let arr5 = ret[5];
      if (Array.isArray(arr5)) {
        this._bonus.push(...arr5);
      }

      if (this._divideInfo.length > 0) {
        this._divideInfo.clear();
      }
      let arr6 = ret[6];
      if (Array.isArray(arr6)) {
        this._divideInfo.push(...arr6);
      }
    }

    this.loaded = true;
  }

  async internalStart(param: any) {
    this.baseItem = param as NStockInfo;
    this.loadData();
    this.openVPage(VStockInfo);
  }

  openMetaView = () => {
  }

}