简体中文 | [English](https://github.com/Basaltic/rethos/blob/main/README.en.md)

# Rethos 

[![NPM Version](https://img.shields.io/npm/v/rethos?style=flat&colorA=brightgreen&colorB=lightgrey)](https://www.npmjs.com/package/rethos)
[![Build Size](https://img.shields.io/bundlephobia/minzip/rethos?label=bundle%20size&style=flat&colorA=brightgreen&colorB=lightgrey)](https://bundlephobia.com/result?p=zustand)

小巧、简洁、强大的React状态管理库。

* **简洁**：只有一个api，不存在过多的样板代码
* **自动订阅**：用到哪个状态就自动订阅该状态并变更，不需要写任何的 select 函数来手动指定
* **Flux架构**：遵循简化的flux架构，使得状态更可控和管理

**⚠️：处于开发中，1.0之前api不稳定**

# 安装

```bash
npm install rethos # or yarn add rethos or pnpm add rethos
```

# 如何使用？

## 1. 定义数据存储

定义 & 创建数据存储，并分别传入默认的状态和action 方法，返回一个实例对象

```ts

```
## 2. 绑定组件

在组件中使用需要绑定的store的hook函数，rethos会自动绑定，并在值发生变化是自动触发组件的更新

```tsx


```


# 接口详情
## 创建Store接口
```ts



```

# 浏览器兼容

| Browser | Supported |
|--|--|
| Chromium | ✅ |
| Edge | ✅ |
| Safari 10+ | ✅ |
| Firefox | ✅ |
| IE | ❌ |

# LICENSE

[MIT](https://github.com/Basaltic/rethos/blob/main/LICENSE)
