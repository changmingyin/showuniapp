import { Store } from 'redux';

import {
  Configurator,
  ConfiguratorProps
} from '../app';

import { HashMap } from '../types';

import Navigator from './navigator';

export abstract class Application {

  private _stores: Store<any>[] = [];
  private _moduleMapping: HashMap<any> = {};

  constructor(
    private _config: ConfiguratorProps
  ) {
    if (this.config.store) {
      this._stores.push(this.config.store);
    }
  }

  get config() {
    return this._config;
  }

  get stores() {
    return this._stores;
  }

  getModule<T>(moduleId: string): T {
    return this._moduleMapping[moduleId];
  }

  getModuleIds() {
    return Object.keys(this._moduleMapping);
  }

  registerModule(moduleId: string, module: any) {
    if (this._moduleMapping.hasOwnProperty(moduleId)) {
      throw new Error(`${moduleId} module exists`);
    }

    this._moduleMapping[moduleId] = module;
  }

  /**
   * 应用程序运行前执行
   */
  onReady() {
    for (let plugin of this.config.plugins) {
      plugin.appOnReadyHook(this);
    }

    this.registerModule('store', this.getStore());
    this.registerModule('navigator', this.getNavigator());
  }

  /**
   * 应用程序运行后执行
   */
  onLaunch() {
    for (let plugin of this.config.plugins) {
      plugin.appOnLaunchHook(this);
    }
  }

  // 应用程序具体的运行方式由 子类实现

  /**
   * 运行应用
   */
  abstract run(): void;

  // 以下两个特殊某块 分配给子类 细化实现

  /**
   * 返回一个标准的 redux store 对象
   */
  protected abstract getStore(): Store<any>;

  /**
   * 返回一个路由导航控制器
   */
  protected abstract getNavigator(): Navigator;
}

export default Application;

/*
// 使用说明

// app 来自 ../app.ts 实现
@app
class MyApp {
  // configuration props ...
}

class MyApplication extends Application {
  getStore() {
    // ...
  }

  getNavigator() {
    // ...
  }

  run() {
    // ...
  }
}

let app = new MyApplication(new MyApp());

app.onReady();
app.run();
app.onLanuch();
*/
