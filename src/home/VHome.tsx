import * as React from 'react';
import { VPage, Page, View, List, LMR } from 'tonva';
import { observer } from 'mobx-react';
import { CHome } from './CHome';
import {observable, IObservableArray, computed} from 'mobx';

interface CatItem {
  title: string;
  sub: string[];
  img: string;
}

interface Cat {
  caption: string;
  items?: CatItem[];
}

const catItemStyle: React.CSSProperties = {
  width: '12rem',
  //height: '6rem', 
  overflow: 'hidden',
};
const subStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};
const imgStyle: React.CSSProperties = {
  //float:'left', clear:'both', 
  height: '1.5rem', width: '1.5rem', opacity: 0.1,
  marginRight: '0.5rem',
};

export class VHome extends View<CHome> {
  async open(param?: any) {
    //await this.controller.searchMain('');
    //this.openPage(this.page);
  }

  private renderSection = (item: any, index: number) => {
    return <section>
      <h4>{item.title}<small className="text-muted">{item.subtitle}</small></h4>
      <p>{item.content}</p>
    </section>
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView, onPage } = this.controller;
    let header = this.controller.renderSiteHeader();
    let viewMetaButton = <></>;
    if (this.controller.isLogined) {
      viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    }

    return <Page header="股票"  onScrollBottom={onPage} 
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private content = observer(() => {
    let {PageItems} = this.controller;
    return <>
      <List
        items={PageItems.items}
        item={{ render: this.renderRow, onClick: this.clickRow, key: this.rowKey }}
        before={'搜索' + ' ' + '资料'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;

  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, symbol } = row;
    return <LMR className="px-3 py-2" left={name} right = {id}>
      <div className="px-3"> {symbol}</div>
    </LMR>
  }

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  protected async onSelected(item: any): Promise<void> {

  }

  private callOnSelected(item: any) {
    if (this.onSelected === undefined) {
      alert('onSelect is undefined');
      return;
    }
    this.onSelected(item);
  }
  clickRow = (item: any) => {
    this.callOnSelected(item);
  }
}