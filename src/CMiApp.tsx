import * as React from 'react';

import { CApp, CUq, Controller, VPage } from './tonva';
import { CHome } from './home/CHome';
import { consts } from './home/consts';
import { WebUser } from './CurrentUser';

export class CMiApp extends CApp {

  currentUser: WebUser;
  currentSalesRegion: any;
  currentLanguage: any;

  cHome: CHome;

  protected async internalStart() {
    if (this.isLogined) {
      //this.currentUser.user = this.user;
    }

    this.cHome = new CHome(this, undefined);

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
