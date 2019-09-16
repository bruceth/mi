import * as React from 'react';
import { VPage, TabCaptionComponent, Page, Tabs } from 'tonva';
import { CMiApp } from '../CMiApp';
import { observable } from 'mobx';
import { meTab } from '../me';

export const store = {
    //homeCount: observable.box<number>(-1),
    //cartCount: observable.box<number>(101),
};

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VHome extends VPage<CMiApp> {
    async open(param?: any) {
        this.openPage(this.render);
    }
    render = (param?: any): JSX.Element => {
        let { cHome, cExporer } = this.controller;
        let faceTabs = [
            { name: 'home', label: '首页', icon: 'home', content: cHome.tab, notify: undefined, load:async()=>{await cHome.load()} },
            { name: 'explorer', label: '发现', icon: 'search', content: cExporer.tab, load: async()=>{await cExporer.load()} },
            { name: 'me', label: '我的', icon: 'user', content: meTab }
        ].map(v => {
            let { name, label, icon, content, notify, load } = v;
            return {
                name: name,
                caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
                content: content,
                notify: notify,
                load: load,
            }
        });
        return <Page header={false}>
            <Tabs tabs={faceTabs} />
        </Page>;
    }
}
