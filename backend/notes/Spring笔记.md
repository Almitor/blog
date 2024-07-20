## Spring5框架笔记

### Spring使用

下载Spring包（https://repo.spring.io/ui/native/release/org/springframework/spring/5.2.9.RELEASE/）

1、创建lib文件夹导入相关Spring的jar包

![image-20230419162506733](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230419162506733.png)

![](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230419162046080.png)

2、导入spring5的jar包，选中5个jar包并导入

![image-20230428145916116](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428145916116.png)

3、创建普通类，并创建普通方法

![image-20230428150333951](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428150333951.png)

```java
package com.my.spring;

public class User {
    public void add(){
        System.out.println("add...");
    }
}
```

4、创建Spring配置文件，在配置文件中配置创建的对象

- 创建xml格式配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--配置User对象创建-->
    <bean id="user" class="com.my.spring.User"></bean>
</beans>
```

5、代码测试

```java
/**
 * 类名不能为Test，否则注解无法自动导入
 */
public class MyTest {

    @Test
    public void Test(){
        //1、加载Spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean1.xml");

        //2、获取配置创建的对象
        User user = context.getBean("user", User.class);
        user.add();
    }
}
```





### IOC容器

1. IOC概念

   - 控制反转，把对象创建和对象之间的调用过程交给Spring进行管理
   - 目的是为了降低耦合度

2. 底层原理

   xml解析、工厂模式、反射

![image-20230428160026222](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428160026222.png)

![image-20230428160112075](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428160112075.png)

![image-20230428160241293](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428160241293.png)

3. IOC接口

   - IOC思想基于IOC容器完成，IOC容器底层就是对象工厂
   
   - Spring提供IOC容器两种实现方式（两种接口）
   
     __BeanFactory__：IOC容器基本实现，是Spring内部的使用接口，一般不提供给开发人员使用。
   
     加载配置文件时不创建对象，在获取对象（使用）才会创建对象
   
     __ApplicationContext__：BeanFactory的子接口，提供更多的强大的功能，一般由开发人员使用。
   
     加载配置文件时会把在配置文件对象进行创建
   
   - ApplicationContext实现类
   
     FileSystemXmlApplicationContext：配置文件的绝对路径
   
     ClassPathXmlApplicationContext：配置文件的相对路径
   
     ![image-20230428161628496](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230428161628496.png)

​		

### IOC操作Bean管理

1. Bean管理
   - Spring创建对象
   - Spring注入属性

2. Bean管理操作方式

   （1）基于xml配置文件方式实现

   - 基于xml方式创建对象

     创建对象时默认执行无参构造方法

     ```xml
     <!--配置User对象创建-->
     <bean id="user" class="com.my.spring.User"></bean>
     ```

   - 基于xml方式注入属性

     **DI**：依赖注入，注入属性

     **使用set方法进行注入：**

     创建类，定义属性和对应的set方法

     ```java
     public class User {
         private String name;
     
         public void setName(String name) {
             this.name = name;
         }
     
         public void add(){
             System.out.println("add...");
         }
     }
     ```

     在配置文件中配置属性注入

     ```xml
     <!--配置User对象创建-->
     <bean id="user" class="com.my.spring.User">
         <!--property完成属性注入，name为属性名，value为属性值-->
         <property name="name" value="小胡"></property>
     </bean>
     ```

     **使用有参构造方法注入：**

     创建类，创建有参构造方法

     ```java
     public class User {
         private String name;
     
         public User(String name) {
             this.name = name;
         }
     
         public void add(){
             System.out.println("add...");
         }
     }
     ```

     在配置文件中进行配置

     ```xml
     <bean id="user" class="com.my.spring.User">
         <!--有参构造方法注入-->
         <constructor-arg name="name" value="aaa"></constructor-arg>
     </bean>
     ```
     
     **注入属性-外部bean：**
     
     创建service类和dao类，在service中调用dao的方法
     
     ```java
     public class userService {
     
         //创建userDao属性，生成set方法
         private userDao userDao;
         public void setUserDao(com.my.spring.dao.userDao userDao) {
             this.userDao = userDao;
         }
     
         public void add(){
             System.out.println("add...");
             userDao.update();
         }
     }
     ```
     
     ```java
     public class userDaoImpl implements userDao{
         @Override
         public void update() {
             System.out.println("update...");
         }
     }
     ```
     
     在Spring配置文件中进行配置
     
     ```xml
     <!--配置userService对象-->
     <bean id="userService" class="com.my.spring.service.userService">
         <!--注入userDao
             name:属性名称
             ref:创建userDao对象bean标签的id值
         -->
         <property name="userDao" ref="userDaoImpl"></property>
     </bean>
     <!--配置userDao对象-->
     <bean id="userDaoImpl" class="com.my.spring.dao.userDaoImpl"></bean>
     ```
     
     **注入属性-内部bean和级联赋值：**
     
     在实体类中表示一对多关系
     
     ```java
     //员工类
     public class Emp {
         private String name;
         private String gender;
         //员工属于某一个部门，使用对象形式表示
         private Dept dept;
     
         public void setName(String name) {
             this.name = name;
         }
     
         public void setGender(String gender) {
             this.gender = gender;
         }
     
         public void setDept(Dept dept) {
             this.dept = dept;
         }
     }
     ```
     
     ```java
     //部门类
     public class Dept {
         private String dname;
     
         public void setDname(String dname) {
             this.dname = dname;
         }
     }
     ```
     
     配置Spring配置文件-内部bean方式
     
     ```xml
     <!--配置内部bean对象-->
     <bean id="emp" class="com.my.spring.bean.Emp" >
         <!--配置普通属性-->
         <property name="name" value="小明"></property>
         <property name="gender" value="男"></property>
         <!--配置对象属性-->
         <property name="dept">
             <bean id="dept" class="com.my.spring.bean.Dept">
                 <property name="dname" value="技术部"></property>
             </bean>
         </property>
     </bean>
     ```
     
     配置Spring配置文件-级联赋值方式一
     
     ```xml
     <bean id="emp" class="com.my.spring.bean.Emp" >
         <!--配置普通属性-->
         <property name="name" value="小明"></property>
         <property name="gender" value="男"></property>
         <!--级联赋值-->
         <property name="dept" ref="dept"></property>
     </bean>
     
     <bean id="dept" class="com.my.spring.bean.Dept">
         <property name="dname" value="技术部"></property>
     </bean>
     ```
     
     配置Spring配置文件-级联赋值方式二，Emp类中需要实现dept属性的get方法
     
     ```xml
     <bean id="emp" class="com.my.spring.bean.Emp" >
             <!--配置普通属性-->
             <property name="name" value="小明"></property>
             <property name="gender" value="男"></property>
             <!--级联赋值-->
             <property name="dept" ref="dept" ></property>
             <property name="dept.dname" value="开发部" ></property>
         </bean>
         <bean id="dept" class="com.my.spring.bean.Dept">
     <!--        <property name="dname" value="技术部"></property>-->
         </bean>
     ```
     
     **集合属性注入**
     
     定义属性并实现set方法
     
     ```java
     public class Student {
         private String[] course;
         private List<String> list;
         private Map<String,String> map;
         private Set<String> set;
         private List<Courses> courses;
     
         public void setCourses(List<Courses> courses) {
             this.courses = courses;
         }
     
         public void setCourse(String[] course) {
             this.course = course;
         }
     
         public void setList(List<String> list) {
             this.list = list;
         }
     
         public void setMap(Map<String, String> map) {
             this.map = map;
         }
     
         public void setSet(Set<String> set) {
             this.set = set;
         }
     
         @Override
         public String toString() {
             return "Student{" +
                     "course=" + Arrays.toString(course) +
                     ", list=" + list +
                     ", map=" + map +
                     ", set=" + set +
                     ", courses=" + courses +
                     '}';
         }
     }
     ```
     
     配置xml文件
     
     ```xml
     <!--集合类型注入-->
     <bean id="student" class="com.my.spring.collections.Student">
         <!--数组类型注入-->
         <property name="course">
             <array>
                 <value>数学</value>
                 <value>英语</value>
             </array>
         </property>
         <!--List类型注入-->
         <property name="list">
             <list>
                 <value>PHP</value>
                 <value>java</value>
             </list>
         </property>
         <!--Map类型注入-->
         <property name="map">
             <map>
                 <entry key="数学" value="1" ></entry>
                 <entry key="英语" value="2" ></entry>
             </map>
         </property>
         <!--Set类型注入-->
         <property name="set">
             <set>
                 <value>Java</value>
                 <value>Java</value>
             </set>
         </property>
         <!--对象属性注入-->
         <property name="courses">
             <list>
                 <ref bean="course1"></ref>
                 <ref bean="course2"></ref>
             </list>
         </property>
     </bean>
     <bean id="course1" class="com.my.spring.collections.Courses">
         <property name="courses" value="Spring框架"></property>
     </bean>
     <bean id="course2" class="com.my.spring.collections.Courses">
         <property name="courses" value="Mybatis框架"></property>
     </bean>
     ```
     
     提取集合注入部分
     
     在Spring配置文件中引入名称空间util
     
     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <beans xmlns="http://www.springframework.org/schema/beans"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:util="http://www.springframework.org/schema/util"
            xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                                http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
         <!--提取list集合属性注入-->
         <util:list id="list">
         	<value>数学</value>
             <value>英语</value>
             <value>化学</value>
         </util:list>
         
         <!--使用提取属性-->
         <bean id="courses" class="com.my.spring.collections.Courses">
         	<property name="list" ref="list"></property>
         </bean>
     </beans>
     ```
     
     **Spring中Bean的类型**
     
     - 普通bean：在配置文件中定义bean类型就是返回类型
     - 工厂bean：在配置文件中定义bean类型可以和返回类型不一样（实现FactoryBean接口）
     
     ```java
     public class Factory implements FactoryBean<Emp> {
         //设置返回类型
         @Override
         public Emp getObject() throws Exception {
             Emp emp = new Emp();
             return emp;
         }
     
         @Override
         public Class<?> getObjectType() {
             return null;
         }
     
         @Override
         public boolean isSingleton() {
             return false;
         }
     }
     ```
   
   
   
   （2）bean的作用域
   
   在Spring配置文件中bean标签里面有属性（scope）设置单实例还是多实例
   
   singleton: 单实例对象（默认值），加载Spring配置文件时就会创建单实例对象。
   
   prototype: 多实例对象，在调用getBean方法时才会创建对象。
   
   
   
   （3）bean的生命周期
   
   1. 通过构造器创建bean实例（调用无参构造方法）
   2. 为bean的属性设置值和对其他bean的应用（调用set方法）
   3. 调用bean的初始化的方法（需要配置初始化方法）
   4. 使用bean（获取bean对象）
   5. 当容器关闭时，调用bean 的销毁方法（需要配置销毁方法）
   
   ```java
   public class Orders {
       String oname;
   
       //无参构造方法
       public Orders() {
           System.out.println("第一步，调用无参构造方法");
       }
   
       //set方法
       public void setOname(String oname) {
           this.oname = oname;
           System.out.println("第二步，调用set方法");
       }
   
       //初始化方法
       public void initMethod(){
           System.out.println("第三步，调用初始化方法");
       }
   
       //销毁方法
       public void destroyMethod(){
           System.out.println("第五步，调用销毁方法");
       }
   }
   ```
   
   ```xml
   <bean id="orders" class="com.my.spring.bean.Orders" init-method="initMethod" destroy-method="destroyMethod">
       <property name="oname" value="aaa"></property>
   </bean>
   ```
   
   ```java
   @Test
   public void Test(){
       //1、加载Spring配置文件
       ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean1.xml");
   
       //2、获取配置创建的对象
       Orders orders = context.getBean("orders",Orders.class);
       System.out.println("第四步，使用对象");
       System.out.println(orders);
       
       context.close();
   }
   ```
   
   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230505151956422.png" alt="image-20230505151956422" style="zoom: 67%;" />
   
   
   
   ​	**bean的后置处理器**
   
   1. 通过构造器创建bean实例（调用无参构造方法）
   2. 为bean的属性设置值和对其他bean的应用（调用set方法）
   3. **把bean实例传递给bean的后置处理器方法**
   4. 调用bean的初始化的方法（需要配置初始化方法）
   5. **把bean实例传递给bean的后置处理器方法**
   6. 使用bean（获取bean对象）
   7. 当容器关闭时，调用bean 的销毁方法（需要配置销毁方法）
   
   ```java
   //后置处理器,实现了BeanPostProcessor
   public class BeanPost implements BeanPostProcessor {
       @Override
       public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
           System.out.println("在初始化之前执行方法");
           return bean;
       }
   
       @Override
       public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
           System.out.println("在初始化之后执行方法");
           return bean;
       }
   }
   ```
   
   ```xml
   <!--在当前配置文件中所有bean实例中都起作用-->
   <bean id="BeanPost" class="com.my.spring.bean.BeanPost"></bean>
   ```
   
   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230505152915658.png" alt="image-20230505152915658" style="zoom:67%;" />
   
   
   
   **xml自动装配**
   
   根据指定装配规则（属性名称或属性类型），Spring自动将匹配的属性值注入
   
   ```xml
   <!--bean标签属性autowire，配置自动装配
       autowire属性常用两个值：
           byName:根据属性名称注入，注入bean的id值和类属性名一致
           byType:根据属性类型注入-->
   <bean id="orders" class="com.my.spring.bean.Orders" autowire="byName">
   <!--<property name="oname" value="aaa"></property>-->
   </bean>
   ```
   
   
   
   **外部属性文件**
   
   配置druid连接池，引入druid连接池依赖jar包
   
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                              http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
   
       <!--配置context名称空间，引入外部属性文件-->
       <context:property-placeholder location="classpath:jdbc.properties"/>
   
       <!--配置druid连接池-->
       <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
           <property name="driverClassName" value="${prop.driverClass}"></property>
           <property name="url" value="${prop.url}"></property>
           <property name="username" value="${prop.userName}"></property>
           <property name="password" value="${prop.password}"></property>
       </bean>
   </beans>
   ```
   
   
   
   外部属性文件
   
   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230507171255401.png" alt="image-20230507171255401" style="zoom:67%;" />
   
   
   
   
   
   （4）基于注解方式实现
   
   1. 什么是注解
      - 注解是代码的特殊标记，格式：@注解名称(属性名称=属性值...)
      - 注解可作用在类上、方法上、属性上面。
      - 使用注解可简化xml配置
   
   2. Spring针对Bean管理中创建对象提供注解
   
      - @Component
      - @Service
      - @Controller
      - @Repository
   
      以上四个注解功能都一样，都可以用来创建bean实例
   
   3. 基于注解方式实现对象创建
   
      * 引入aop依赖jar包
      * 开启组件扫描
   
      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:context="http://www.springframework.org/schema/context"
             xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                                 http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
      
          <!--开启组件扫描
              1、扫描多个包使用逗号隔开
              2、使用包的上层目录-->
          <context:component-scan base-package="com.my.spring.aop"/>
      </beans>
      ```
   
      - 创建类，在类上面添加创建对象的注解
   
      ```java
      /**
       * 在注解里面value可以忽略不写
       * 默认值为类名称，首字母小写
       */
      @Component(value = "user1") //等价于 <bean id="user1" class="包路径"/>
      public class User1 {
          public void add(){
              System.out.println("add...");
          }
      }
      ```
   
   4. 开启组件扫描细节配置
   
      ```xml
      <!--示例1
          use-default-filters="false" 表示不使用默认filter,手动配置filter
          context:include-filter,设置扫描内容-->
      <context:component-scan base-package="com.my.spring" use-default-filters="false">
          <context:include-filter type="annotation"
                                  expression="org.springframework.stereotype.Controller"/>
      </context:component-scan>
      
      <!--示例2
          context:exclude-filter,设置不扫描内容-->
      <context:component-scan base-package="com.my.spring" use-default-filters="false">
          <context:exclude-filter type="annotation"
                                  expression="org.springframework.stereotype.Controller"/>
      </context:component-scan>
      ```
   
   5. 基于注解方式实现属性注入
   
      (1) @Autowired：根据属性类型进行注入
   
      - 创建Service和Dao对象，在Service和Dao类上添加创建对象注解
      - 在Service中注入Dao对象，在Service添加Dao类型属性，在属性上面使用注解
   
      (2) @Qualifier：根据属性名称进行注入
   
      - 需要和@Autowired搭配一起使用
   
      (3) @Resource：既可以根据属性类型注入，也可以根据属性名称进行注入
   
      (4) @Value：注入普通类型属性
   
      ```java
      @Repository
      public class UserDaoImpl implements UserDao1{
          @Override
          public void Dao() {
              System.out.println("dao....");
          }
      }
      ```
   
      ```java
      @Service
      public class UserService {
      
          //定义Dao属性,不需要添加set方法，添加注入属性注解
          @Autowired
          @Qualifier(value = "userDaoImpl") //区分不同接口实现类对象,类名首字母小写
      //    @Resource //根据类型注入
      //    @Resource(name = "UserDaoImpl") //根据名称进行注入
          private UserDao1 userDao1;
      
          @Value(value = "aaa")
          private String name;
      
          public void service(){
              System.out.println("service...");
              userDao1.Dao();
          }
      }
      ```
   
   6. 完全注解开发
   
      (1)创建配置类，替代配置文件
   
      ```java
      @Configuration //作为配置类替代xml配置文件
      @ComponentScan(basePackages = "com.my.spring")
      public class SpringConfig {
      }
      ```
   
      ```java
      @Test
      public void Test2(){
          //1、加载Spring配置类
          ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);
      
          //2、获取配置创建的对象
          UserService userService = context.getBean("userService", UserService.class);
          userService.service();
      }
      ```





### Aop

1. Aop概念

   (1) 面向切面编程，利用Aop可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发效率。

   (2) 不通过修改源代码方式，就能在主干功能里面添加新功能

   (3) 使用登录用例说明Aop

   ![image-20230509083855725](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509083855725.png)



2. 底层原理

   (1) 有接口情况，使用JDK动态代理

   创建接口实现类代理对象，增强类的方法

   ![image-20230509085144260](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509085144260.png)

   

   ```java
   public class UserDaoImpl implements UserDao{
       @Override
       public int add(int a,int b) {
           System.out.println("add方法执行了.....");
           return a+b;
       }
   
       @Override
       public void update() {
           System.out.println("update方法执行了......");
       }
   }
   ```

   ```java
   public class JDKProxy {
       public static void main(String[] args) {
           //创建接口实现类代理对象
           Class[] interfaces = {UserDao.class};
           //内部类方式实现创建代理对象
           //        Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, new InvocationHandler() {
           //            @Override
           //            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           //                return null;
           //            }
           //        });
           //外部类方式实现创建代理对象
           UserDaoImpl userDao = new UserDaoImpl();
           UserDao dao = (UserDao) Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, new UserDaoProxy(userDao));
           int add = dao.add(1, 2);
           System.out.println(add);
       }
   }
   
   //创建代理对象
   class UserDaoProxy implements InvocationHandler{
   
       private Object obj;
   
       //通过有参构造方法传递被代理对象
       public UserDaoProxy(Object obj){
           this.obj = obj;
       }
   
       //对象被创建后即调用该方法，编写增强的逻辑
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
   
           //方法之前
           System.out.println("方法之前执行了..."+method.getName()+" :传递的参数："+ Arrays.toString(args));
   
           //被增强的方法
           Object res = method.invoke(obj,args);
           
           //方法之后
           System.out.println("方法之后执行了...."+obj);
           return res;
       }
   }
   ```

   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509092858101.png" alt="image-20230509092858101" style="zoom:67%;" />

   

   

   (2) 没有接口情况，使用CGLIB动态代理

   创建子类的代理对象，增强类的方法

   ![image-20230509085211829](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509085211829.png)

3. AOP术语

   ![image-20230509093726124](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509093726124.png)

4. AOP操作

   (1) Spring框架一般都是基于AspectJ实现AOP操作，AspectJ不是Spring组成部分，独立AOP框架，一般把AspectJ和Spring框架一起使用，进行AOP操作。

   (2) 基于AspectJ实现AOP操作

   - 基于xml配置文件
   - 基于注解方式

   (3) 引入AOP相关依赖jar包

   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230509152601327.png" alt="image-20230509152601327" style="zoom:67%;" />

   (4) 切入点表达式

   - 对类中方法进行增强

   - 语法结构

     > execution（【权限修饰符】【返回类型】【类全路径】【方法名称】（【参数列表】））

​			例：execution(*com.my.spring.aop.proxy.UserDao.add(..)) 对类里面的add方法增强

​		(5) AOP操作

**基于AspectJ注解方式实现**

1. 创建类，在类中定义方法

2. 创建增强类，编写增强逻辑

   ```Java
   //增强类
   public class UserProxy {
   
       //前置通知
       public void before(){
           System.out.println("before.....");
       }
       //后置通知
       public void after(){
           System.out.println("after......");
       }
   }
   ```

3. 进行通知配置

   (1) 在Spring配置文件中，开启注解扫描

   (2) 使用注解创建User和UserProxy对象 

   (3) 在增强类上面添加注解@Aspect

   ```java
   //增强类
   @Component
   @Aspect //生成代理对象
   public class UserProxy {
   
       //前置通知
       public void before(){
           System.out.println("before.....");
       }
       //后置通知
       public void after(){
           System.out.println("after......");
       }
   }
   ```

   (4) 在Spring配置文件中开启生成代理对象

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                              http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                              http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
   
       <!--开启组件扫描-->
       <context:component-scan base-package="proxy.annoaop"/>
   
       <!--开启Aspect生成代理对象-->
       <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
   </beans>
   ```

4. 配置不同类型的通知

   (1) 在增强类中，对通知方法添加注解，使用切入点表达式配置

   ```java
   //增强类
   @Component
   @Aspect  //生成代理对象
   public class UserProxy {
   
       //前置通知
       @Before(value = "execution(* com.myspring.aop.User.add(..))")
       public void before(){
           System.out.println("before.....");
       }
   
       //后置通知
       @After(value = "execution(* com.myspring.aop.User.add(..))")
       public void after(){
           System.out.println("after......");
       }
   
       //环绕通知
       @Around(value = "execution(* com.myspring.aop.User.add(..))")
       public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
           System.out.println("环绕前。。。。");
           proceedingJoinPoint.proceed();
           System.out.println("环绕后。。。。。");
       }
   }
   ```

5. 公共切入点抽取

   ```java
   //增强类
   @Component
   @Aspect  //生成代理对象
   public class UserProxy {
   
       //抽取切入点
       @Pointcut(value = "execution(* com.myspring.aop.User.add(..))")
       public void pointCut(){
   
       }
   
       //前置通知
       @Before(value = "pointCut()")
       public void before(){
           System.out.println("before.....");
       }
   
       //后置通知
       @After(value = "pointCut()")
       public void after(){
           System.out.println("after......");
       }
   
       //环绕通知
       @Around(value = "pointCut()")
       public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
           System.out.println("环绕前。。。。");
           proceedingJoinPoint.proceed();
           System.out.println("环绕后。。。。。");
       }
   }
   ```

   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230522154458799.png" alt="image-20230522154458799" style="zoom:67%;" />

   

6. 有多个增强类对同一个方法进行增强，设置增强类优先级

   ```java
   @Component
   @Aspect
   @Order(1) //设置优先级，数值越小，优先级越高
   public class PersonProxy {
   
       @Before(value = "execution(* com.myspring.aop.User.add(..))")
       public void before(){
           System.out.println("person before....");
       }
   }
   ```

   <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230522154903044.png" alt="image-20230522154903044" style="zoom:67%;" />

7. 完全使用注解开发

   创建配置类

   ```java
   @Configuration
   @ComponentScan(basePackages = {"com.myspring.aop"}) //组件扫描
   @EnableAspectJAutoProxy(proxyTargetClass = true) //开启生成代理对象
   public class Config {
   }
   ```

**基于AspectJ配置文件方式实现**

1. 创建类和增强类，定义方法

   ```java
   public class User1 {
       public void add(){
           System.out.println("add....");
       }
   }
   ```

   ```java
   public class UserProxy1 {
       public void before(){
           System.out.println("before.....");
       }
   }
   ```

2. 在Spring配置文件中创建两个对象

3. 在配置文件中配置切入点

   ```xml
   <!--创建对象-->
   <bean id="user1" class="com.myspring.aop.User1"></bean>
   <bean id="userProxy1" class="com.myspring.aop.UserProxy1"></bean>
   
   <!--配置aop增强-->
   <aop:config>
       <!--切入点-->
       <aop:pointcut id="p" expression="execution(* com.myspring.aop.User1.add(..))"/>
       <!--切面-->
       <aop:aspect ref="userProxy1">
           <!--增强作用在具体方法上-->
           <aop:before method="before" pointcut-ref="p"></aop:before>
       </aop:aspect>
   </aop:config>
   ```



### JdbcTemplate

1. 什么是JdbcTemplate

   Spring框架对JDBC进行封装，使用JdbcTemplate方便实现对数据库的操作

2. 准备工作

   (1) 引入相关依赖

   ```xml
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
       <version>8.0.23</version>
   </dependency>
   
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-jdbc</artifactId>
       <version>5.2.15.RELEASE</version>
   </dependency>
   
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-tx</artifactId>
       <version>5.2.15.RELEASE</version>
   </dependency>
   
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-orm</artifactId>
       <version>5.2.15.RELEASE</version>
   </dependency>
   
   <dependency>
       <groupId>com.alibaba</groupId>
       <artifactId>druid</artifactId>
       <version>1.2.6</version>
   </dependency>
   ```

   (2) 在配置文件中配置数据库连接池

   (3) 配置JdbcTemplate对象，注入DataSource

   ```xml
   <!--开启组件扫描-->
   <context:component-scan base-package="com.myspring.JdbcTemplate"/>
   
   <!--数据库连接池-->
   <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" destroy-method="close">
       <property name="url" value="jdbc:mysql://localhost:3306/user_db"/>
       <property name="username" value="root"/>
       <property name="password" value="root"/>
       <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
   </bean>
   
   <!--JdbcTemplate对象-->
   <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
       <!--注入DataSource-->
       <property name="dataSource" ref="dataSource"></property>
   </bean>
   ```

   (4) 创建service类，dao类，在dao中注入JdbcTemplate对象

   ```java
   @Repository
   public class UserDaoImpl implements UserDao {
   
       //注入JdbcTemplate
       @Autowired
       private JdbcTemplate jdbcTemplate;
   }
   ```

   ```java
   @Service
   public class UserService {
   
       //注入Dao
       @Autowired
       private UserDao userDao;
   }
   ```

3. JdbcTemplate操作数据库

   创建实体类并实现相关set和get方法

   ```java
   @Service
   public class UserService {
   
       //注入Dao
       @Autowired
       private UserDao userDao;
   
       //添加方法
       public void add(User user){
           userDao.add(user);
       }
   
       //查询方法
       public User find(int id){
           return userDao.find(id);
       }
   
       //查询集合
       public List<User> findAll(){
           return userDao.findAll();
       }
   
       //批量添加
       public void adds(List<Object[]> users){
           userDao.addAll(users);
       }
   }
   ```
   
   ```java
   @Repository
   public class UserDaoImpl implements UserDao {
   
       //注入JdbcTemplate
       @Autowired
       private JdbcTemplate jdbcTemplate;
   
       //添加方法
       public void add(User user) {
           String sql = "insert into user values(?,?,?)";
           jdbcTemplate.update(sql,user.getId(),user.getName(),user.getSex());
       }
   
       //查询方法
       public User find(int id) {
           String sql = "select * from user where id=?";
           User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<User>(User.class), id);
           return user;
       }
   
       //查询集合
       public List<User> findAll() {
           String sql = "select * from user";
           List<User> query = jdbcTemplate.query(sql, new BeanPropertyRowMapper<User>(User.class));
           return query;
       }
   
       //批量添加
       public void addAll(List<Object[]> objects) {
           String sql = "insert into user values(?,?,?)";
           jdbcTemplate.batchUpdate(sql,objects);
       }
   }
   ```



### 事务操作

1. 概念

   (1) 事务时数据库操作最基本单元，逻辑上一组操作，要么都成功，如果有一个失败所有操作都失败。

2. 特性（ACID）

   (1) 原子性

   (2) 一致性

   (3) 隔离性

   (4) 持久性

<img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524171549701.png" alt="image-20230524171549701" style="zoom:67%;" />

创建Service和Dao，在Service中注入Dao，在Dao中注入JdbcTemplate，在JdbcTemplate中注入DataSource

```java
@Repository
public class AccountDaoImpl implements AccountDao{

    @Autowired
    private JdbcTemplate jdbcTemplate;

    //增加金额
    @Override
    public void addMoney() {
        String sql = "update account set money=money+? where name=?";
        jdbcTemplate.update(sql,100,"Jack");
    }

    //减少金额
    @Override
    public void reduceMoney() {
        String sql = "update account set money=money-? where name=?";
        jdbcTemplate.update(sql,100,"Bob");
    }
}
```

```java
@Service
public class AccountService {

    @Autowired
    private AccountDao accountDao;
	
    //转账方法
    public void accountMoney(){
        //若方法执行期间发生异常，则不能保证数据库操作的一致性
        
        //一、开启事务
        //二、进行业务操作
        accountDao.reduceMoney();
        accountDao.addMoney();
        //三、提交事务
        //四、若发生异常，则回滚事务
        System.out.println("转账成功");
    }
}
```

3. 事务操作

   (1) 一般将事务添加到Service层

   (2) Spring进行事务管理操作

   - 编程式事务管理
   - 声明式事务管理（底层使用AOP原理）

   (3) 声明式事务管理

   - 基于注解方式
   - 基于xml配置文件方式

   (4) Spring事务管理API

   ​	提供一个接口，代表事务管理器，这个接口针对不同的框架提供不同的实现类

   ![image-20230524174930843](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524174930843.png)

4. 基于注解方式进行事务操作

   (1) 在配置文件中创建配置管理器

   (2) 开启事务注解

   - 在配置文件中引入名称空间tx
   - 开启事务注解

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:tx="http://www.springframework.org/schema/tx"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                              http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                              http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">
   
       <!--开启组件扫描-->
       <context:component-scan base-package="com.myspring.transaction"/>
   
       <!--数据库连接池-->
       <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" destroy-method="close">
           <property name="url" value="jdbc:mysql://localhost:3306/user_db"/>
           <property name="username" value="root"/>
           <property name="password" value="root"/>
           <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
       </bean>
   
       <!--JdbcTemplate对象-->
       <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
           <!--注入DataSource-->
           <property name="dataSource" ref="dataSource"></property>
       </bean>
   
       <!--创建事务管理器-->
       <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
           <!--注入DataSource-->
           <property name="dataSource" ref="dataSource"></property>
       </bean>
   
       <!--开启事务注解-->
       <tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven>
   </beans>
   ```

   (3) 在Service类上或方法上添加事务注解

   ![image-20230524175901557](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524175901557.png)

   (4) 参数配置

   - propagation：事务传播行为

     <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524180644672.png" alt="image-20230524180644672"  />

     ![image-20230524180909870](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524180909870.png)

     ![image-20230524181142532](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524181142532.png)

     ![image-20230524181410195](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524181410195.png)

   - isolation：事务隔离级别

     有三个读的问题：脏读、不可重复读、虚读（幻读）

     脏读：一个未提交的事务读取到另一个未提交的事务的数据

     ![image-20230524181832415](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524181832415.png)

     

     不可重复读：一个未提交事务读取到另一个已提交事务的**修改**数据

     ![image-20230524182038281](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524182038281.png)

     

     虚读：一个未提交事务读取到另一个已提交事务的**添加**数据

     <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524182256370.png" alt="image-20230524182256370" style="zoom:67%;" />

     ![image-20230524182533143](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230524182533143.png)

   - timeout：超时时间

     事务需要在一定时间内进行提交，如果不提交则进行回滚

     默认值为-1，单位为秒

   - readOnly：是否只读，默认为false，表示可增删改查

   - rollbackFor：回滚

     设置出现那些异常进行事务回滚

   - norollbackFor：不回滚

     设置出现那些异常不进行事务回滚

5. 基于xml方式进行事务管理

   (1) 配置事务管理器

   (2) 配置通知

   (3) 配置切入点和切面

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:tx="http://www.springframework.org/schema/tx"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                              http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                              http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
                              http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">
   
       <!--开启组件扫描-->
       <context:component-scan base-package="com.myspring.transaction"/>
   
       <!--数据库连接池-->
       <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" destroy-method="close">
           <property name="url" value="jdbc:mysql://localhost:3306/user_db"/>
           <property name="username" value="root"/>
           <property name="password" value="root"/>
           <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
       </bean>
   
       <!--JdbcTemplate对象-->
       <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
           <!--注入DataSource-->
           <property name="dataSource" ref="dataSource"></property>
       </bean>
   
       <!--创建事务管理器-->
       <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
           <!--注入DataSource-->
           <property name="dataSource" ref="dataSource"></property>
       </bean>
   
       <!--配置通知-->
       <tx:advice id="txadvice">
           <!--配置事务参数-->
           <tx:attributes>
               <!--指定哪种规则的方法上面添加事务-->
               <tx:method name="accountMoney" propagation="REQUIRED" isolation="DEFAULT"/>
               <!--            <tx:method name="account*"/>-->
           </tx:attributes>
       </tx:advice>
   
       <!--配置切入点和切面-->
       <aop:config>
           <!--配置切入点-->
           <aop:pointcut id="pt" expression="execution(* com.myspring.transaction.service.AccountService.*(..))"/>
           <!--配置切面-->
           <aop:advisor advice-ref="txadvice" pointcut-ref="pt"/>
       </aop:config>
   </beans>
   ```

6. 完全注解开发

   ```java
   @Configuration //配置类
   @ComponentScan(basePackages = "com.myspring.transaction")
   @EnableTransactionManagement //开启事务
   public class TXConfig {
       //创建数据库连接池
       @Bean
       public DruidDataSource getDruidDataSource(){
           DruidDataSource dataSource = new DruidDataSource();
           dataSource.setUsername("root");
           dataSource.setPassword("root");
           dataSource.setUrl("jdbc:mysql://localhost:3306/user_db");
           dataSource.setDriverClassName("com.mysql.jdbc.Driver");
           return dataSource;
       }
   
       //创建JdbcTemplate对象
       @Bean
       public JdbcTemplate getJdbcTemplate(DataSource dataSource){
           //到ioc容器中根据类型找到dataSource
           JdbcTemplate jdbcTemplate = new JdbcTemplate();
           //注入DataSource
           jdbcTemplate.setDataSource(dataSource);
           return jdbcTemplate;
       }
   
       //创建事务管理器对象
       @Bean
       public DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource){
           DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
           dataSourceTransactionManager.setDataSource(dataSource);
           return dataSourceTransactionManager;
       }
   }
   ```

