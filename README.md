# zation-service-mysql ⚙️
*Zation service for MySQL*

<h1 align="center">
  <!-- Logo -->
  <br/>
  <a href="https://zation.io">
      <img src="https://zation.io/img/zationWideLogo.svg" alt="Logo Zation" height="200"/>
  </a>
  <br/>
</h1>

<h1 align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg" alt="API Stability"/>
  </a>
  <!-- TypeScript -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/zation-service-mysql">
    <img src="https://img.shields.io/npm/dm/zation-service-mysql.svg" alt="Downloads"/>
  </a>
  <!-- Size -->
  <a href="https://npmjs.org/package/zation-service-mysql">
      <img src="https://img.shields.io/bundlephobia/min/zation-service-mysql.svg" alt="Size"/>
  </a>
</h1>

## What is Zation-service-mysql?
***Zation-service-mysql*** is a zation service wrapper of the npm package [mysql](https://www.npmjs.com/package/mysql) for creating connections to MySQL servers.
This service will automatically create connection pools with your provided instance configurations.
Also, it will extend the Bag with new functionality to easily access your databases.

## Install

```bash
$ npm install --save zation-service-mysql
```

## Usage
To use this service, you have to define it in the services configuration of your zation server.
To do this, you use the default exported function that requires an instances argument.
In this argument, you can define different database connection configurations linked to a name (instanceName).
The connection settings are the same as in the npm module [mysql](https://www.npmjs.com/package/mysql).
If you only want to specify one connection setting or
you have a primary connection setting that you will use the most it is recommended to use the default instance name for it.
That will make it later easier to access your connection because you don't have to provide every time the instance name.

```typescript
import {Config}         from 'zation-server';
import MySqlService     from "zation-service-mysql";

export default Config.servicesConfig({
    ...MySqlService({
        default: {
            port: 3306,
            database: 'MyFirstDatabase',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            charset: 'utf8mb4_unicode_ci'
        },
        secondDb: {
            port: 3307,
            database: 'MySecondDatabase',
            user: process.env.DB_SECOND_USER,
            password: process.env.DB_SECOND_PASSWORD,
            charset: 'utf8mb4_unicode_ci'
        }
    })
});
```
In this example code, the zation server will create two connection pools in the start process with the two configurations.
After the launch, these two pools can be accessed by using the Bag.

### Access
To access your connections, you can use one of these new functionalities that will be added to the Bag class.
Notice that this service also adds the typescript definitions.
The new functionalities:

* `getMySql` (`Function (instanceName?: string): Promise<MySql.Pool>`) - This function returns the MySQL service instance as a MySql.Pool,
if it exists otherwise, it will throw a ServiceNotFoundError error.
It takes a instance name as an argument if you don't provide one it will use the default instance name.

* `hasMySql` (`Function (instanceName?: string): boolean`) - This function returns a boolean that indicates if the MySQL service instance exists.
If you don't provide a instance name, it will use the default instance name.

* `mySqlFormat` (`Function (query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string) => string`) - With this function, you can format mysql queries to escaping query values.
Its the same function as the format function from the mysql npm package.
```typescript
const sql = bag.mySqlFormat('SELECT * FROM posts WHERE id = ?', [42]);
console.log(sql); // SELECT * FROM posts WHERE id = 42
```

* `mySqlQuery` (`Function (query: string, instanceName?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>`) - With this function, you can make a simple promise based MySQL query by using one of your service instances.
Notice that this function can throw a ServiceNotFoundError error if the MySQL service with the instance name is not found.
The function takes a query and the instance name as arguments.
If you don't provide a instance name, it will use the default instance name.
```typescript
const res = await bag.mySqlQuery('SELECT * FROM user WHERE id = 1');
if(res.results[0]){
    return res.results[0];
}
else {
    bag.throwNewBackError({name : 'userNotFound'})
}
```

## License

MIT License

Copyright (c) 2021 Ing. Luca Gian Scaringella

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
