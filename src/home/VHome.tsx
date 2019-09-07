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

    return <Page header="股票列表"  onScrollBottom={onPage} 
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private onSelect = (item:any, isSelected:boolean, anySelected:boolean) => {

  }

  private renderTestRow = () => {
    return <div>ddd</div>
  }

  private content = observer(() => {
    let {PageItems} = this.controller;
    let header = <div className="px-3">
      <div className="px-3" style={this.width6} />
      <div className="px-3" style={this.width8}>PE</div>
      <div className="px-3" style={this.width8}>ROE</div>
      <div className="px-3" style={this.width8}>PRICE</div>
    </div>;
    return <>
      <List header={header}
        items={PageItems.items}
        item={{ render: this.renderRow, onClick: this.onSelected, key: this.rowKey }}
        before={'搜索' + ' ' + '资料'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  private width6 = {width: '6rem'};
  private width8 = {width: '8rem'};
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order } = row as {id:number, name:string, code:string, symbol:string, pe:number, roe:number, price:number, order:number};
    let left = <div className="" style={this.width6}><span className="text-primary">{name}</span><br/>{code}</div>
    return <LMR className="px-3 py-2" left={left} right = {order.toString()} onClick={()=>this.onClickName(row)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 d-flex" style={this.width8}>{pe.toFixed(2)}</div>
        <div className="px-3" style={this.width8}> {(roe * 100).toFixed(2)}</div>
        <div className="px-3" style={this.width8}> {price.toFixed(2)}</div>
      </div>
    </LMR>
  }

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  protected onClickName = (item: any) => {
    let {symbol} = item;
    let url = `http://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
    var win = window.open(url, '_blank');
    win.blur();
    window.focus();
    return false;
  }

  protected onSelected = async (item: any): Promise<void> => {
    let a = 0;
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