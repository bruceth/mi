import * as React from 'react';
import { VPage, Page, View, List, LMR } from 'tonva';
import { observer } from 'mobx-react';
import { CStockInfo } from './CStockInfo'

export class VStockInfo extends VPage<CStockInfo> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView } = this.controller;
    let viewMetaButton = <></>;
    if (this.controller.isLogined) {
      viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    }

    return <Page header="股票信息"
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private width6 = {width: '6rem'};
  private width8 = {width: '8rem'};


  private content = observer(() => {
    let header = <div className="px-3">
      <div className="px-3" style={this.width6} />
      <div className="px-3" style={this.width8}>PE</div>
      <div className="px-3" style={this.width8}>ROE</div>
      <div className="px-3" style={this.width8}>PRICE</div>
    </div>;
    return <>
    jflajfdasflj
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order } = row as {id:number, name:string, code:string, symbol:string, pe:number, roe:number, price:number, order:number};
    let left = <div className="" style={this.width6}><span className="text-primary">{name}</span><br/>{code}</div>
    return <LMR className="px-3 py-2" left={left} right = {order.toString()}>
      <div className="d-flex flex-wrap">
        <div className="px-3 d-flex" style={this.width8}>{pe.toFixed(2)}</div>
        <div className="px-3" style={this.width8}> {(roe * 100).toFixed(2)}</div>
        <div className="px-3" style={this.width8}> {price.toFixed(2)}</div>
      </div>
    </LMR>
  }
}