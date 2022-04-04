# 0.7.0

* 重新设计api，单体store，状态和行为分离

--- 

* redesign the api, one store, separate state and actions

# 0.6.0

* 最后稳定了接口的风格，createStore 函数会返回一个对象，包含各种方法和react hook方法
* 支持嵌套的action执行自动合并提交更新
* 增加了文档目录中的例子和样式

---

* make the api stable, finally, the createStore function wil return a object with functions & hooks
* support auto-batch update in nested actions
* improve examples in doc folder

# 0.5.0

* 支持自动订阅数组对象
* 添加额外的文档目录

---

* suport auto subscribe array value
* add doc folder

# v0.4.0

* 支持 store family 的创建
* 完善文档

---

* suport store family
* improve docs
# v0.3.1

* 添加config参数
* 支持delete关键词在action中的使用
* 优化组件卸载后自动销毁订阅的函数
* 完善文档

---

* add new 'config' as the third params
* support delete state prop in action
* clean the subscribed func after component unmount
* improve docs


# v0.3.0

* 支持action方法自定义传参
* 完善readme文档

---

* support pass custom args in action function
* improve the docs

# v0.2.2

* 优化缓存state和action对象
* 添加更多的测试用例

--- 

* memorize the state & action
* add more test case

# v0.2.0

* 支持自动监听嵌套的对象的值
* 默认导出 hook 函数

---

* support obseve nested object
* export state and action hooks as default

