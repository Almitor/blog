## JDBC笔记

### 概念

JDBC：Java Database Connectivity，Java数据库连接技术

在Java代码中，使用JDBC提供的方法，可以发送字符串类型的SQL语句到数据库管理软件（MySQL，Oracle），并获取语句执行结构，进而实现数据库curd操作的技术。

![image-20230526150249058](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230526150249058.png)

jdbc由两部分组成：一是Java提供的jdbc规范（接口），二是各个数据库厂商的实现驱动jar包，是一种典型的面向接口编程技术

### jdbc核心API

1. 引入MySQL-jdbc驱动jar包
2. jdbc使用步骤

![image-20230526151936549](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20230526151936549.png)

```java
package com.study.jdbc;

import com.mysql.cj.jdbc.Driver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

//静态SQL
public class JDBCTest {

    /**
     * DriverManager
     * Connection
     * Statement
     * ResultSet
     */
    public static void main(String[] args) throws Exception {

        //1、注册驱动
        /**
         * 依赖：驱动版本 8+ com.mysql.cj.jdbc.Driver
         *      驱动版本 5+ com.mysql.jdbc.Driver
         */
        DriverManager.registerDriver(new Driver());

        //2、获取连接
        /**
         * Java程序和数据库创建连接
         *      数据库ip地址 127.0.0.1
         *      端口号 3306
         *      账号 root
         *      密码 root
         *      连接数据库的名称 user_db
         *
         *  参数1: url
         *         jdbc:数据库厂商名://ip地址:端口号/数据库名称
         *         jdbc:mysql://127.0.0.1:3306/user_db
         *  参数2：username root
         *  参数3：password root
         */
        Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/user_db","root","root");

        //3、创建Statement对象
        Statement statement = connection.createStatement();

        //4、发送请求并接收
        String sql = "select * from user";
        ResultSet resultSet = statement.executeQuery(sql);

        //5、请求结果解析
        while (resultSet.next()){
            //按行获取数据
            int id = resultSet.getInt("id");
            String name = resultSet.getString("name");
            String sex = resultSet.getString("sex");
            System.out.println(id+" "+name+" "+sex);
        }

        //6、关闭资源
        resultSet.close();
        statement.close();
        connection.close();
    }
}
```

动态sql，防止sql注入攻击

```java
public class PreparedStatementTest {
    public static void main(String[] args) throws Exception{
        //注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");

        //建立连接
        Connection connection = DriverManager.getConnection("jdbc:mysql:///user_db?user=root&password=root");

        //编写sql语句结构
        String sql = "select * from user where name=?";

        //创建预编译statement并且设置sql语句结构
        PreparedStatement preparedStatement = connection.prepareStatement(sql);

        //单独的占位符赋值
        preparedStatement.setObject(1,"jack");

        //获取请求结果
        ResultSet resultSet = preparedStatement.executeQuery();

        if (resultSet.next()){
            System.out.println("成功");
        }else {
            System.out.println("失败");
        }

        //释放资源
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```

Druid连接池工具类封装

```java
/**
 * 内部包含一个连接池对象，并对外提供获取连接和回收连接的方法
 * 工具类方法一般设置为静态方法，外部调用会更加方便
 *
 * 属性 连接池对象（实例化一次）
 *      单例模式
 *      static{
 *          全局调用一次
 *      }
 * 方法
 *      对外提供连接的方法
 *      回收外部传入连接方法
 */
public class DruidUtil {
    //连接池对象
    private static DataSource dataSource = null;

    static {
        //初始化连接池对象
        Properties properties = new Properties();
        InputStream ips = JdbcUtils.class.getClassLoader().getResourceAsStream("druid.properties");
        try {
            properties.load(ips);

        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            dataSource = DruidDataSourceFactory.createDataSource(properties);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 对外提供的连接方法
     */
    public static Connection getConnection() throws Exception{
        return dataSource.getConnection();
    }

    /**
     * 回收方法
     */
    public static void freeConnection(Connection connection) throws Exception{
        connection.close();
    }
}
```

```properties
driverClassName=com.mysql.cj.jdbc.Driver
username=root
password=root
url=jdbc:mysql:///user_db
```











​	
