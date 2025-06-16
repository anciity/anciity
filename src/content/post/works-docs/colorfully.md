---
title: Colorfully
description: 一个横跨多端的前端主题动态管理库
seriesId: works-docs
orderInSeries: 3
publishDate: 06 Sep 2023
tags: ['JavaScript', 'CSS', 'CSS Variable', '主题']
---



## ✨特性

Colorfully 的核心功能就是使用 `JavaScript` 控制 `CSS Variable` 以及 `HTML Attrbute`，来达到动态主题的效果。

- 强大：**局部主题**
- 灵活：**编程式创建**、**动态导入导出配置**
- 激发：**自定义主题包**
- 友好：**`TypeScript` 类型支持**、**`CSS Variable` 智能提示**
- 迅速：**快速接入主流组件库**、**脚手架快速创建主题包**
- 包容：**小程序支持**、**自定义渲染**



## 📦安装

```bash
npm i colorfully
```



## 使用

Colorfully 的使用方式有很多种，这也使得它足以支撑大多数应用场景的原因。



### 初始化

初始化创建主题，具有更好的类型支持。

你可以使用它：**自定义主题包**。



#### 创建样式

首先我们创建一个色彩样式，同时定义其下样式类型以及样式变量。

```typescript
import { CSSStyle } from 'colorfully';

export const color = new CSSStyle('色彩', 'color', {
    light: {
        name: '浅色',
        code: 'light',
        variables: {
            '--color-1': {
                name: '',
                code: '--color-1',
                value: '#e6fffb'
            },
            '--color-2': {
                name: '',
                code: '--color-2',
                value: '#b5f5ec'
            },
            ...{ /* more */}
        }
    },
    dark: {
        name: '深色',
        code: 'dark',
        variables: {
            '--color-1': {
                name: '',
                code: '--color-1',
                value: '#112123'
            },
            '--color-2': {
                name: '',
                code: '--color-2',
                value: '#113536'
            },
            ...{ /* more */}
        }
    }
})
```

你还可以创建更多，如：`shadow` 、`space`、...



统一导出样式

```typescript
import { CSSStyle } from 'colorfully';
import { color } from './color';
import { shadow } from './shadow';
import { space } from './space';

export const defaultStyleMap = { color, space, shadow };
```



如果你想在创建方案时有更友好的提示，你可以这样做：

```typescript
export type DefaultStyleMap<T = typeof defaultStyleMap> = {
  [K in keyof T]: T[K] extends CSSStyle<infer V> ? V : void;
};
```



#### 创建方案

接下来我们创建一个主题方案：

```typescript
import { DefaultStyleMap } from '../style';
import { CSSSchema } from 'colorfully';

export const lightSchema = new CSSSchema<DefaultStyleMap>('浅色主题', 'light', {
  color: 'light',
  shadow: 'default',
  space: 'default'
});
```

你还可以创建更多，如：`darkSchema` 、`defaultSchema`、...



统一导出方案

```typescript
import { defaultSchema } from './default';
import { darkSchema } from './dark';
import { lightSchema } from './light';

export const defaultSchemaMap = { default: defaultSchema, dark: darkSchema, light: lightSchema };
```



#### 实例化

创建好了主题和方案之后，我们就可以去实例化 `Colorfully` 类了。

```typescript
import { Colorfully } from 'colorfully';
import { defaultStyleMap } from './style';
import { defaultSchemaMap } from './schema';

const theme = new Colorfully({ styleMap: defaultStyleMap, schemaMap: defaultSchemaMap });
```



#### 导出实例化类

实例化后便可以导出使用了。

```typescript
export default theme;
```



同时你也可以导出主题类型：

```typescript
export type ThemeType = typeof theme;
```

它可以在你只需要类型提示时使用。



到现在为止，你就拥有了**初始化创建主题**，它具有良好的开发类型提示，这使你在使用 `theme.schema` `API` 时具有良好的类型提示。



### 编程式

使用编程式 `API` 创建主题，具有更好的可编程性。

你可以使用它：**动态创建方案**、**动态创建样式**、**动态修改变量**、...

甚至还可以将主题的控制权交给用户。



#### 实例化

与初始化创建不同的是，编程式创建需要先进行 `Colorfully` 的实例化。

```typescript
const theme = new Colorfully();
```



#### 导出实例化类

将实例化类进行导出。

```typescript
export default theme
```



#### 创建样式

同样的我们以色彩样式示例：

```typescript
import theme from "./theme";

theme.style.create('色彩', 'color', {
  light: {
      name: '浅色',
      code: 'light',
      variables: {
          '--color-1': {
              name: '',
              code: '--color-1',
              value: '#e6fffb'
          },
          '--color-2': {
              name: '',
              code: '--color-2',
              value: '#b5f5ec'
          },
          ...{ /* more */}
      }
  },
  dark: {
      name: '深色',
      code: 'dark',
      variables: {
          '--color-1': {
              name: '',
              code: '--color-1',
              value: '#112123'
          },
          '--color-2': {
              name: '',
              code: '--color-2',
              value: '#113536'
          },
          ...{ /* more */}
      }
  }
})
```

同样的，你还可以创建更多，如：`shadow` 、`space`、...



#### 创建方案

接下来使用 `API` 创建一个方案：

```typescript
import theme from "./theme";

theme.schema.create('浅色主题', 'light', { color: 'light', shadow: 'default', space: 'default' });
```

你还可以创建更多，如：`darkSchema` 、`defaultSchema`、...



### 配置化

与其他使用方案不同的是，在配置化中，你可以很灵活的自由导出导出主题配置。

你可以用它实现：**远程加载主题**、**动态导入主题**、**主题分享**、...



#### 实例化

同样与初始化创建不同的是，配置化创建需要先进行 `Colorfully` 的实例化。

```typescript
const theme = new Colorfully();
```



#### 导出实例化类

将实例化类进行导出。

```typescript
export default theme
```



#### 导入配置（创建样式及方案）

使用 `theme.import` `API` 可以统一导入样式及方案。

```typescript
import theme from "./theme";

const config: ColorfullyConfig = {
  styles: [
    {
      name: '色彩',
      code: 'color',
      types: [
        {
          name: '浅色',
          code: 'light',
          variables: [{ name: '', code: '--color-1', value: '#e6fffb' }]
        }
        /* ... */
      ]
    }
    /* ... */
  ],
  schemas: [
    { name: '浅色主题', code: 'light', map: { color: 'light', shadow: 'default', space: 'default' } }
    /* ... */
  ]
};

theme.import(config);
```



#### 导出配置

使用 `theme.export` `API` 可以统一导出样式及方案。

```typescript
import theme from "./theme";

const config = theme.export()
```



### 引入使用

在使用主题时你可以使用 `theme.use` 方法指定主题方案。

```typescript
import { theme } from "./theme"

theme.use('default')
```



#### 使用参数

> 如果你在 `new Colorfully` 时未传入 `UseParams` 或你使用的是主题包时，可以使用 `theme.updateDefaultUseParams` 更新你的 `UseParams`。

`UseParams` 具体参数如下：

```typescript
/**
 * 使用参数
 */
export interface UseParams<StyleMap extends Record<string, CSSStyle<any, any, any>>> {
    /**
     * 主题根节点
     * @default html
     * @description 也是选择器的挂载点。
     */
    root?: HTMLElement;
    /**
     * 模式
     * @default "css"
     * @description ‘css’ 模式也就是 'all in' 所有 css 都会提前生成挂载，'js' 模式也就是 'Import on demand' 所有的 css 都会被 js 按需导入。
     */
    mode?: 'css' | 'js';
    /**
     * 选择器模式
     * @description 决定挂载器是属性模式还是类名模式。
     */
    selectorMode?: 'attr' | 'class';
    /**
     * 自定义挂载
     * @description 对不支持 dom 操作的情况提供自定义渲染支持。
     */
    customMount?: {
        /**
         * 选择器
         * @param themeMap { groupCode: typeCode }
         */
        selector: (themeMap: Record<string, string>) => void;
        /**
         * 样式
         * @param styleList 样式列表
         */
        style: (styleList: {
            code: string;
            css: string;
            /**
             * mode === 'js' 时才会有
             */
            variables?: Array<CSSStyleVariable>;
        }[], 
        /**
         * mode === 'js' 时才会有
         */
        styleMap?: ExtractVariableMap<StyleMap>) => void;
    };
}
```

通过上述属性达到更高的兼容性以及扩展性。



## 场景

接下来给出不同场景下的，解决方案。



### 对接组件库

**Q**：在我们的日常开发中，避免不了使用各式各样的组件库，那么我们如何快速接入呢？

**A**：因为设计原因，我们的选择器优先级大于大部分组件库的声明选择器，所以我们可以直接对接组件库的变量名，从而达到覆盖的目的。

我们就拿 `antd` 来进行示例。

我们首先在项目调试窗口查看其变量命名，分析过后得出其变量命名的规则。

同时在查阅 `Ant Design` 的[设计语言](https://ant-design.gitee.io/docs/spec/colors-cn)后，分析出其使用 [`@ant-design/colors`](https://www.npmjs.com/package/@ant-design/colors) 快速生成十个色阶，并对各类行为规定了对应的色阶号。

由此可得：

```typescript
import { generate } from "@ant-design/colors"

const getAntdColor = ({ color, name, dark, emitColors }: { color: string, name: string, dark?: boolean, emitColors?: boolean }) => {
  const colors = generate(color, { "theme": dark ? "dark" : "default" })
  const alias = [{ name: '', value: 6 }, { name: 'hover', value: 5 }, { name: 'active', value: 7 }, { name: 'outline', value: 1 }]
  const aliasMap = alias.reduce((map, item) => {
    const code = `--ant-${name}-color${item.name ? `-${item.name}` : ''}`
    const value = colors[item.value - 1]
    map[code] = {
      name: '',
      code,
      value
    }
    return map
  }, {} as Record<string, any>)

  return {
    ...aliasMap, ...(emitColors ? colors.reduce((map, item, index) => {
      const code = `--ant-${name}-${index + 1}`
      const value = item
      map[code] = {
        name: '',
        code,
        value
      }
      return map
    }, {} as Record<string, any>) : {})
  }
}
```

有了这个方法我们就可以快速的创建与其对应的变量。

```typescript
export const color = new CSSStyle('色彩', 'color', {
  light: {
    name: '浅色',
    code: 'light',
    variables: {
      ...getAntdColor({ "color": '#13c2c2', "name": 'primary', "emitColors": true }),
      ...getAntdColor({ "color": '#1890ff', "name": 'info' }),
      ...getAntdColor({ "color": '#52c41a', "name": 'success' }),
      ...getAntdColor({ "color": '#faad14', "name": 'warning' }),
      ...getAntdColor({ "color": '#ff4d4f', "name": 'error' })
    }
  },
  dark: {
    name: '深色',
    code: 'dark',
    variables: {
      ...getAntdColor({ "color": '#13a8a8', "name": 'primary', "emitColors": true, dark: true }),
      ...getAntdColor({ "color": '#177ddc', "name": 'info', dark: true }),
      ...getAntdColor({ "color": '#49aa19', "name": 'success', dark: true }),
      ...getAntdColor({ "color": '#d89614', "name": 'warning', dark: true }),
      ...getAntdColor({ "color": '#a61d24', "name": 'error', dark: true })
    }
  }
});

```

这样在项目中就可以自由的使用 `Colorfully` 的功能了。



### 自适应主题

**Q**：什么是自适应主题呢？

**A**：自适应是指根据环境因素的不同有不同的展现。

接下来我们来看一个实例，你一定见过跟随系统的明暗主题，即在系统中设置浅色或深色时界面随之改变。

`Windows` 下的明暗设置可以在其设置的颜色设置中找到（选择模式）进行设置。

那么我们如何在代码中获取到这个设置呢？

在 `CSS` 中，我们可以通过 `@media` 获取到，也就是当 `@media (prefers-color-scheme: light)` 时为浅色模式，为 `@media (prefers-color-scheme: dark)` 时为深色模式。

那么我们就可以思考如何将它集成进我们的 `color` `CSSStyle` 中。

首先我们添加一个 `color` 的类型为 `default` 表示跟随系统的变化而变化，然后我们继承类 `CSSStyle` 改写其 `parcel` 方法。

```typescript
class ColorCSSStyle<T extends string> extends CSSStyle<T> {
  parcel(type: T | (string & Record<never, never>), value: string) {
    if (type === 'default') {
      return this.getAll()
        .filter(type => type.code !== 'default')
        .map(
          type => `@media (prefers-color-scheme: ${type.code}) {
*[ data-theme-color = 'default' ] {
${this.toTypeString(type.code)}
}
}`
        )
        .join('\n');
    }

    return super.parcel(type, value);
  }
}

export const color = new ColorCSSStyle('色彩', 'color', {
	default: { name: '默认', code: 'default', variables: {} },
    light: {/*...*/},
    dark: {/*...*/},
})
```

虽然 `default` 的 `variables` 值为空对象，但是这并不影响其 `CSS` 样式的生成，因为我们已经改写了 `color` 的 `parcel` 方法，使其检测到类型为 `default` 时，自动生成自适应的 `@media` 选择器。

> 以上方案在不复杂的场景下适用。
>
> 但是由于配置的自由度比较高，所以在我们重新创建 `CSSStyle` 后，我们使用的并不是 `ColorCSSStyle`，这会带来一定的问题。
>
> 因此我们内置了它，当 `type` 为 `default` 时，且 `variables` 为 `{}`，我们将会在内部为你自动提供媒体查询功能。

可直接写为：

```typescript
export const color = new CSSStyle('色彩', 'color', {
	default: { name: '默认', code: 'default', variables: {} },
    light: {/*...*/},
    dark: {/*...*/},
})
```



### 范围主题

**Q**：什么是范围主题？

**A**：这其实就是字面意思，想象一下我们并不想让部分元素跟随主题变化，而是拥有其独特的属性存在，这就是范围主题的诞生。

我们只需要给使用范围指定主题的元素加上 `data-theme-color` 属性并给到指定值 `dark` 就可以指定其 `color` 样式为深色。

**Q**：这是基础的控制，那么我们可以像 `theme` 一样管理它吗？

**A**：也是可以的，你只需要初始化一个新的 `Colorfully` 并且传递其 `root` 参数为你需要使用范围主题的元素就可以了。

如果你不想再重新设置一遍，也可以直接从 `theme` 中使用 `theme.derive` 方法派生出一个实例，同样的你也需要指定其 `root` 参数。

```typescript
theme.derive({ root: dom });
```



### 支持小程序

**Q**：小程序如何使用 `Colorfully` 呢？

**A**：由于小程序不支持操作 `dom`，所以我们只能通过 `data` 配合自定义渲染的形式进行挂载。

首先我们 `pageStyle` 一个 `data`，并将他挂载在标签的 `style` 属性上，然后通过 `theme.updateDefaultUseParams` 进行自定义渲染配置。

```typescript
onLoad() {
    theme.updateDefaultUseParams({
        "mode": 'js',
        "selectorMode": 'class',
        "customMount": {
            "selector": _themeMap => {},
            "style": (styleList) => {
                let pageStyle = '';
                styleList.forEach(style => {
                    style.variables?.forEach(variable => {
                        pageStyle += `${variable.code}: ${variable.value};`;
                    });
                });
                this.setData({ pageStyle });
            }
        }
    })

    theme.use('light')
}
```

这样我们就算是接入了 `Colorfully` 的主题管理系统了。

对于小程序的监听系统主题改变，可以使用 `wx.onThemeChange` 方法自行实现。

每个页面都这样，那可就太麻烦了，所以我们结合混入来快速实现每个页面同样一致的效果：

```typescript
Object.assign(globalThis, {
    Page: function (params: Parameters<typeof Page>[0]) {
        const onLoad = params.onLoad;

        params.onLoad = function (...args) {
            theme.updateDefaultUseParams({
                mode: 'js',
                selectorMode: 'class',
                customMount: {
                    selector: _themeMap => {},
                    style: styleList => {
                        let pageStyle = '';
                        styleList.forEach(style => {
                            style.variables?.forEach(variable => {
                                pageStyle += `${variable.code}: ${variable.value};`;
                            });
                        });
                        this.setData({ pageStyle });
                    }
                }
            });

            theme.use('light');

            return onLoad?.call(this, ...args);
        };

        _Page(params);
    }
});
```

然后我们在首页引入这个混入操作，同时在需要使用  `CSS Variable` 的页面包裹一个：

```html
<page-meta page-style="{{pageStyle}}">
    <view class="index">
        
    </view>
</page-meta>
```

这样就达到了我们想要的效果。



### 支持 React Native

**Q**：`React Native` 如何使用 `Colorfully` 呢？

**A**：在 `React Native` 中并没有 `CSS`，因为它采用的是类似CSS的概念，且只能从组件的 `style` 注入。我们可以将 `Colorfully` 的主题通过变量这个载体传入。

接下来让我们看看如何实现吧。

我们首先把 `style` 交给 `Mobx` 进行状态管理：

```typescript
import theme from '@xxx/theme';
import { makeAutoObservable, runInAction } from 'mobx';

class ThemeStore {
  // 推断 styleMap 类型
  style = {} as Exclude<
    Parameters<Exclude<Parameters<typeof theme.updateDefaultUseParams>['0']['customMount'], undefined>['style']>['1'],
    undefined
  >;

  constructor() {
    makeAutoObservable(this);
  }

  init() {
    theme.updateDefaultUseParams({
      mode: 'js',
      customMount: {
        selector: () => null,
        style: (_, styleMap) => {
          if (styleMap)
            runInAction(() => {
              this.style = styleMap;
            });
        }
      }
    });

    theme.use('light');
  }
}

const themeStore = new ThemeStore();

export default themeStore;
```

我们在声明 `style` 时，给到它类型推断，这样你在使用 `style` 时就可以得到类型提示了。

然后在组件中使用它：

```react
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import theme from '@xxx/theme';
import themeStore from './store/theme';

// 初始化主题
themeStore.init();

export function App() {
  const systemTheme = useColorScheme() ?? 'light';

  useEffect(() => {
    // 自适应系统深浅色主题
    theme.use(systemTheme);
  }, [systemTheme]);

  return (
    <View>
      {/* 使用主题 */}
      <Observer>
          {() => 
          	<Text style={{ color: themeStore.style.color['--color-text-primary'] }}>
               测试
           	</Text>
          }
      </Observer>
    </View>
  );
}

registerRootComponent(App);
```

这样就可以了，可以开心的使用 `Colorfully` 了。

你一定很好奇为什么要这样写 `themeStore.style.color['--color-text-primary']`，其中 `color` 的 `key` 是你自己定义的。

你可以在定义主题时这样写：

```typescript
import { CSSStyle } from 'colorfully';

export const color = new CSSStyle('色彩', 'color', {
    light: {
        name: '浅色',
        code: 'light',
        variables: {
            textPrimary: {
                name: '',
                code: '--color-text-primary',
                value: '#262626'
            },
            ...{ /* more */}
        }
    },
    dark: {
        name: '深色',
        code: 'dark',
        variables: {
            textPrimary: {
                name: '',
                code: '--color-text-primary',
                value: '#dbdbdb'
            },
            ...{ /* more */}
        }
    }
})
```

那么对于的使用：

```react
<Observer>
    {() => 
    <Text style={{ color: themeStore.style.color.textPrimary }}>
         测试
     </Text>
    }
</Observer>
```

这样看起来顺眼多了对吧。

再告诉你一个小技巧，按照以下形式写将会得到类型提示的描述：

```typescript
import { CSSStyle } from 'colorfully';

/**
 * 样式变量
 */
export interface IStyleVariable<T = string> {
  /**
   * 名称
   */
  name: string;
  /**
   * 代码
   */
  code: string;
  /**
   * 值
   */
  value: T;
}

/**
 * 颜色变量
 */
interface IColorVariable {
  /**
   * 主要文本
   */
  textPrimary: IStyleVariable;
  [k: string]: any;
}

export const color = new CSSStyle('色彩', 'color', {
  light: {
    name: '浅色',
    code: 'light',
    variables: {
      textPrimary: {
        name: '',
        code: '--color-text-primary',
        value: '#262626'
      }
    } as IColorVariable
  },
  dark: {
    name: '深色',
    code: 'dark',
    variables: {
      textPrimary: {
        name: '',
        code: '--color-text-primary',
        value: '#dbdbdb'
      }
    } as IColorVariable
  }
});
```

这样约束 `variables` 的同时，你也可以得到类型提示的描述了。



## 主题包

> 当你有多个项目时，如何复用就显得尤为重要了。

你可以将你预设好的主题，打包发布到 `NPM` 方便其他项目复用。

你只需包含基于 `CommonJS` 规范的 `lib/index.js` 并提供默认导出 `theme` 以供接下来的智能提示使用即可。



## 智能提示

既然创建了主题，那么必然有使用主题的时候。

我们在使用 `CSS` 变量的时候，是没有智能提示的，那也就代表着我们处于一个摸黑的状态。

那么如何打破这个黑暗就显得尤为重要了。

我们只需要安装 `VSCode` 中的 `CSS Smart` 插件即可解决这个问题。

具体查看 [`CSS Smart`](https://marketplace.visualstudio.com/items?itemName=City.css-smart) 中的介绍使用。

我们在插件中实现了主题包的智能提示解决方案，也就是动态执行 `lib/index.js` 得到其所有变量值来进行提示。

我们也会考虑后续执行本地暴露文件的可能性。



## 接口

这里不介绍具体 `API` 了，`TypeScript` 开发的懂得都懂，且以上示例比较全面。



### ThemeParameters

```typescript
/**
 * 主题参数
 */
export interface ThemeParameters<StyleMap, SchemaMap> {
  /**
   * 样式配置图
   */
  styleMap?: StyleMap;
  /**
   * 主题配置图
   */
  schemaMap?: SchemaMap;
  /**
   * 默认使用参数
   */
  defaultUseParams?: UseParams;
}
```



### ColorfullyConfig

配置格式。

```typescript
/**
 * 主题配置
 */
export interface ColorfullyConfig {
  /**
   * 样式
   */
  styles: Array<{
    /**
     * 名称
     */
    name: string;
    /**
     * 代码
     */
    code: string;
    /**
     * 类型
     */
    types: Array<{
      /**
       * 名称
       */
      name: string;
      /**
       * 代码
       */
      code: string;
      /**
       * 变量
       */
      variables: Array<{
        /**
         * 名称
         */
        name: string;
        /**
         * 代码
         */
        code: string;
        /**
         * 值
         */
        value: string;
      }>;
    }>;
  }>;
  /**
   * 方案
   */
  schemas: Array<{
    /**
     * 名称
     */
    name: string;
    /**
     * 代码
     */
    code: string;
    /**
     * { 样式 : 类型 }
     */
    map: Record<string, string>;
  }>;
}
```
