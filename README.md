# zation-service-mysql ⚙️
*Zation service module for MySQL*
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
***Zation-service-mysql*** is a zation service module wrapper of the npm package [mysql](https://www.npmjs.com/package/mysql) for creating connections to MySQL servers.
This module will automatically create connection pools with your provided configurations on each worker. 
Also, it will add new functionality to the SmallBag and Bag for easy accessing your databases.

## Install

```bash
$ npm install --save zation-service-mysql
```

## Usage

To use this module, you have to define it in the service configuration of your zation server. 
Therefore you must use the build method, and this method requires a configuration argument. 
In the configuration argument, you can define different database connection configurations linked to a name (configName). 
The connection settings are the same as in the npm module [mysql](https://www.npmjs.com/package/mysql).  
If you only want to specify one connection setting or 
you have a primary connection setting that you will use the most it is recommended to use the default config name for it.
That will make it later easier to access your connection because you don't have to provide every time the config name.

```typescript
import {Config}         from 'zation-server';
import MySqlModule      from "zation-service-mysql";

module.exports = Config.serviceConfig(
    { 
        serviceModules : [
        MySqlModule.build({
            default : {
                port : 3306,
                database : 'MyFirstDatabase',
                user : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                charset : 'utf8mb4_unicode_ci'
            },
            secondDb : {
                port : 3307,
                database : 'MySecondDatabase',
                user : process.env.DB_SECOND_USER,
                password : process.env.DB_SECOND_PASSWORD,
                charset : 'utf8mb4_unicode_ci'
            }
        })]
    });
```
In this example code, each worker of the zation server will create two connection pools in the start process with the two configurations.
After the launch, these two pools can be accessed by using a SmallBag or Bag. 
If something goes wrong by creating the connection, the server won't start or notify you with a console.log it depends on your configurations of the server.

### Access 
For access to your connections, you can use one of these new functionalities that will be added to the SmallBag class. 
Notice that this module also adds the typescript definitions and 
that you can use these methods even on the Bag class because the Bag is extending the SmallBag.
The new functionalities:

* `getMySql` (`Function (configName ?: string): Promise<MySql.Pool>`) - This function returns the MySQL service as a MySql.Pool, 
if it exists otherwise, it will throw a ServiceNotFoundError error. 
It takes a config name as an argument if you don't provide one it will use the default config name. 
                                
* `isMySql` (`Function (configName ?: string): boolean`) - This function returns a boolean that indicates if the MySql service with the given configuration name exists. 
If you don't provide a config name, it will use the default name.

* `mySqlFormat` (`Function (query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string) => string`) - With this function, you can format mysql queries to escaping query values. 
Its the same function as the format function from the mysql npm package. 
```typescript
const sql = smallBag.mySqlFormat('SELECT * FROM posts WHERE id = ?', [42]);
console.log(sql); // SELECT * FROM posts WHERE id = 42
```

* `mySqlQuery` (`Function (query : string, configName ?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>`) - With this function, you can make a simple promise based MySQL query by using one of your services. 
Notice that this function can throw a ServiceNotFoundError if the MySQL service with the config name is not found. 
The function takes a query and the config name as arguments.
If you don't provide a config name, it will use the default name.
```typescript
const res = await bag.mySqlQuery('SELECT * FROM user WHERE id = 1');
if(res.results[0]){
    return res.results[0];
}
else {
    bag.throwNewTaskError({name : 'userNotFound'})        
}
```

## License

MIT License

Copyright (c) 2019 Luca Scaringella

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
