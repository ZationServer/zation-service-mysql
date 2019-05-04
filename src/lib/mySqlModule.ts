/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import MySql         = require("mysql");
import {ServiceModule} from "zation-service";
import {PoolConfig}    from "mysql";
import {SmallBag}      from "zation-server";

const serviceName = "MySql";

export namespace MySqlModule {

    export function build(configs: Record<string, PoolConfig> | DefaultConfig<PoolConfig>): ServiceModule<PoolConfig, MySql.Pool,{},SmallBagExtension> {
        const service: any = configs;
        service.get = undefined;
        service.create = async (c: PoolConfig): Promise<MySql.Pool> => {
            const mySql = MySql.createPool(c);
            await new Promise<void | string>((resolve, reject) => {
                mySql.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        connection.release();
                        resolve();
                    }
                });
            });
            return mySql;

        };

        return {
            serviceName: serviceName,
            service: service,
            bagExtensions: {
                smallBag : {
                    mySqlQuery : async function (this : SmallBag,query ,configName : string = 'default') : Promise<{results : any,fields : MySql.FieldInfo[]}> {
                        return new Promise<{results : any,fields : MySql.FieldInfo[]}>(async (resolve, reject) =>
                        {
                            (await this.getService<MySql.Pool>(serviceName,configName)).
                            query(query,(error, results : any, fields : MySql.FieldInfo[]) => {
                                if(error) {reject(error);}
                                else{resolve({results : results, fields : fields});}
                            });
                        });
                    },
                    mySqlFormat : function(query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string) : string {
                        return MySql.format(query,inserts,stringifyObjects,timeZone);
                    },
                    getMySql : async function(this : SmallBag,configName : string = 'default') : Promise<MySql.Pool>
                    {
                        return await this.getService<MySql.Pool>(serviceName,configName);
                    },
                    isMySql : function (this : SmallBag,configName : string = 'default') : boolean
                    {
                        return this.isService(serviceName,configName);
                    }
                }
            }
        };
    }

}

interface DefaultConfig<T> {
    default?: T;
}

interface SmallBagExtension
{
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can make a simple promise based MySQL query by using one of your services.
     * Throws an ServiceNotFoundError if the service is not found.
     * @example
     * const res = await mySqlQuery('SELECT 1 + 1 AS solution');
     * const solution = res.results[0];
     * @throws ServiceNotFoundError
     * @param  query
     * @param  configName Default: 'default'
     * @return Promise<object>
     * The object has 2 fields, one for the result 'result' and one for the fields information 'fields'.
     */
    mySqlQuery: (query: string, configName ?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    /**
     * @description
     * Format a MySQL query.
     * @example
     * mySqlFormat('SELECT * FROM ?? WHERE ?? = ?',['users', 'id', 10]);
     * @param  query
     * @param inserts
     * @param stringifyObjects?
     * @param  timeZone?
     * @return string
     */
    mySqlFormat: (query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string) => string

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the MySQL service, if it exists otherwise, it will throw a ServiceNotFoundError error.
     * @throws ServiceNotFoundError
     * @param  configName Default: 'default'
     */
    getMySql(configName ?: string): Promise<MySql.Pool>

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function returns a boolean that indicates if the MySQL service with the given configuration name exists.
     * @param  configName Default: 'default'
     */
    isMySql(configName ?: string): boolean
}

declare module 'zation-server' {
    export interface SmallBag extends SmallBagExtension {
    }
}