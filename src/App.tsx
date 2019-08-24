import * as React from 'react';
import './App.css';
import { NavView, nav, Page, Tabs } from 'tonva';
import { startApp } from 'tonva';
import ui from './ui';
//import { faceTabs } from 'facetabs';

class App extends React.Component {

  private onLogined = async () => {
    await startApp(ui);
    /*
    let page = <Page header={false}>
      <Tabs tabs={faceTabs} />
    </Page>
    nav.push(page);
    */
    //let b = new B('b');
    //await b.d();
    //nav.push(<div>ddd</div>)
  }
  public render() {
    return <NavView onLogined={this.onLogined} />
  }
}

export default App;