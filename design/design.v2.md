## concepts

- entity（实体）: present a piece of state of the whole app
  - entity descriptor - describe the structure of the entity
  - entity instance - a inited instance of the entity based of the descriptor of entity
- processor（处理器）：used to process state entities
  - global processor -  use all the entity as the input params & process them
  - entity instance processor - only process one entity instance
- container（容器）：manage the entity & processor


## hooks

- useEntity(e, id)
  - auto register the entity descriptor if container provider existed
  - e -> support entity descriptor & entity type
  - id -> identifier of the **entity instance**
- useProcessor(p)
  - 


## Draft

processor
使用annotation可以生成依赖图方便调试
没有使用annotaion的话，只能依赖运行的时候去检测了
- class 的创建方法
- function 的创建方法
p -> p1 -> p2
     p1 -> p3

processor group => to manage the processor
- create a batch of simple proceesor in a simple way

processor middleware

fragment (state) 是打平的，单独的定义
f -> f1
  -> f2
  -> f3

query =>  used to aggerate state & subscribe the state change


container.bind(processer) => ...
container.bind({ a: processor}) 绑定一组处理

executor.execute => 执行处理器
execute => processor func |
