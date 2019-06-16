import * as React from 'react';
import { CTuidMain } from '../tonva';
import { VSiteHeader } from './VSiteHeader';
import { CMiApp } from '../CMiApp';
import { PageItems, Controller } from '../tonva';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';

class HomeSections extends PageItems<any> {

    private sectionTuid: CTuidMain;

    constructor(sectionTuid: CTuidMain) {
        super();
        this.firstSize = this.pageSize = 13;
        this.sectionTuid = sectionTuid;
    }

    protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        return undefined;
    }

    protected setPageStart(item: any): any {
        if (item === undefined) return 0;
        return item.id;
    }
}

export class CHome extends Controller {

    cApp: CMiApp;
    homeSections: HomeSections;

    constructor(cApp: CMiApp, res: any) {
        super(res);

        this.cApp = cApp;
    }

    async internalStart(param: any) {
        this.openVPage(VHome);
    }

    renderSiteHeader = () => {
        return this.renderView(VSiteHeader);
    }

    renderSearchHeader = (size?:string) => {
        return this.renderView(VSearchHeader, size);
    }

    renderHome = () => {
        return this.renderView(VHome);
    }

    openMetaView = () => {
    }

    tab = () => <this.renderHome />;
}