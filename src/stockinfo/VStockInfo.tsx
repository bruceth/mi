import * as React from 'react';
import { VPage, Page, View, List, LMR, left0 } from 'tonva';
import { observer } from 'mobx-react';
import { CStockInfo } from './CStockInfo'
import { NStockInfo, StockCapitalearning, StockBonus } from './StockInfoType';

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
      headerClassName='bg-primary'>
      <this.content />
    </Page>;
  })

  private content = observer(() => {
    return <>
      <this.baseInfo />
      <this.capitalEarning />
      <this.bonus />
    </>
  });

  private caption = (value:string) => <span className="text-muted small">{value}: </span>;
  

  private baseInfo = () => {
    let { name, code, pe, roe, price, order } = this.controller.baseItem;
    let left = <div className="c6"><span className="text-primary">{name}</span><br />{code}</div>
    return <>
      <div className="px-3 py-1">名称</div>
      <LMR className="px-3 py-2 bg-white" left={left} onClick={() => this.onClickName(this.controller.baseItem)}>
        <div className="d-flex flex-wrap">
          <div className="px-3 c8">{this.caption('PE')}{pe.toFixed(2)}</div>
          <div className="px-3 c8">{this.caption('ROE')}{(roe * 100).toFixed(2)}</div>
          <div className="px-3 c8">{this.caption('Price')}{price.toFixed(2)}</div>
        </div>
      </LMR>
    </>
  }

  protected onClickName = (item: NStockInfo) => {
    let { symbol } = item;
    event.preventDefault();
    let url = `http://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
    window.open(url, '_blank');
  }

  private capitalEarning = observer(() => {
    let items = this.controller.capitalearning;
    let header = <div className="px-3">
      <div className="px-3 c6">年</div>
      <div className="px-3 c6 text-right">股本</div>
      <div className="px-3 c6 text-right">收益</div>
      <div className="px-3 c6 text-right">ROE</div>
    </div>;
    return <>
      <div className="px-3 py-1">历年股本收益</div>
      <List header={header} loading="..."
        items={items}
        item={{
          render: (row: StockCapitalearning) => {
            let {capital, earning} = row;
            return <div className="px-3 py-2 d-flex flex-wrap">
              <div className="px-3 c6">{row.year}</div>
              <div className="px-3 c6 text-right"> {capital.toFixed(2)}</div>
              <div className="px-3 c6 text-right"> {earning.toFixed(2)}</div>
              <div className="px-3 c6 text-right"> {(earning/capital).toFixed(2)}</div>
            </div>
          }
        }}
      />
    </>
  });

  private bonus = observer(() => {
    let items = this.controller.bonus;
    let header = <div className="px-3">
      <div className="px-3 c8">日期</div>
      <div className="px-3 c6 text-right">分红</div>
    </div>;
    return <>
      <div className="px-3 py-1">历年分红</div>
      <List header={header} loading="..."
        items={items}
        item={{
          render: (row: StockBonus) => {
            return <div className="px-3 py-2 d-flex flex-wrap">
              <div className="px-3 c8">{row.day}</div>
              <div className="px-3 c6 text-right"> {row.bonus.toFixed(2)}</div>
            </div>
          }
        }}
      />
    </>
  });
}