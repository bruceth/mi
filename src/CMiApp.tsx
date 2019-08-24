import * as React from 'react';
import { CApp, CUq, Controller, VPage } from './tonva';
import { CHome } from './home/CHome';
import { consts } from './home/consts';
import { MiApi } from './net/miApi';
import {nav} from 'tonva';

export class CMiApp extends CApp {
  cHome: CHome;
  miApi: MiApi;

  protected async internalStart() {
    if (this.isLogined) {
    }

    let miHost = consts.isDevelopment ? consts.miApiHostDebug : consts.miApiHost;
    this.miApi = new MiApi(miHost, 'fsjs/', 'miapi', this.name, false);
    this.cHome = new CHome(this, undefined);
    let params = [];
    //let ret = await this.miApi.page('q_stocksquery', params, 0, 100);
    let n = nav;
    let env = process.env;
    this.cHome.searchMain('');
    this.showMain();
  }

  showMain(initTabName?: string) {
    this.openVPage(this.VAppMain, initTabName);
  }

  public async showOneVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void> {
    await (new vp(this)).open(param);
  }

  protected onDispose() {
  }
}
