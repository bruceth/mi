import * as React from 'react';
import { CTuidMain } from '../tonva';
import { VSiteHeader } from './VSiteHeader';
import { CMiApp } from '../CMiApp';
import { PageItems, Controller } from '../tonva';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';

class HomePageItems<T> extends PageItems<T> {
    cHome: CHome;
    constructor(cHome: CHome) {
        super(true);
        this.cHome = cHome;
        this.pageSize = 30;
        this.firstSize = 30;
    }
    protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let result = await this.cHome.cApp.miApi.page('q_stocksquery', [], pageStart, pageSize);
        if (Array.isArray(result) === false) return [];
        return result as any[];
    }
    protected setPageStart(item: any) {
        this.pageStart = item === undefined ? 0 : item.id;
    }
}

export class CHome extends Controller {
    PageItems: PageItems<any>;

    cApp: CMiApp;

    vHome: VHome;

    constructor(cApp: CMiApp, res: any) {
        super(res);

        this.cApp = cApp;
        this.vHome = new VHome(this);
    }

    protected buildPageItems(): PageItems<any> {
        return new HomePageItems<any>(this);
    }

    async searchMain(key: string) {
        if (this.PageItems === undefined) {
            this.PageItems = this.buildPageItems();
        }
        if (key !== undefined) await this.PageItems.first(key);
    }


    async internalStart(param: any) {
        this.openVPage(VHome);
    }

    renderSiteHeader = () => {
        return this.renderView(VSiteHeader);
    }

    renderSearchHeader = (size?: string) => {
        return this.renderView(VSearchHeader, size);
    }

    renderHome = () => {
        return this.vHome.render(undefined);
    }

    openMetaView = () => {
    }

    tab = () => <this.renderHome />;
}