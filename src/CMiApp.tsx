import * as React from 'react';
import { CApp, CUq, Controller, VPage, CAppBase } from 'tonva';
import { CHome } from './home';
import { consts } from './consts';
import { MiApi } from './net';
import {nav} from 'tonva';
import { VHome } from 'ui/main';

export class CMiApp extends CAppBase {
  cHome: CHome;
  miApi: MiApi;

  protected async internalStart() {
    if (this.isLogined) {
    }

    let n = nav;

    let token = this.user.token;

    let miHost = consts.isDevelopment ? consts.miApiHostDebug : consts.miApiHost;
    this.miApi = new MiApi(miHost, 'fsjs/', 'miapi', token, false);
    this.cHome = this.newC new CHome(this, undefined);
    let params = [];
    //let ret = await this.miApi.page('q_stocksquery', params, 0, 100);
    let env = process.env;
    this.cHome.searchMain('');
    //this.showMain();
    this.openVPage(VHome);
  }

  /*
  showMain(initTabName?: string) {
    this.openVPage(this.VAppMain, initTabName);
  }*/

  public async showOneVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void> {
    await (new vp(this)).open(param);
  }

  protected onDispose() {
  }
}
