/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import MySql = require("mysql");
import {ServiceModule} from "zation-service";
import {PoolConfig} from "mysql";
import {SmallBag,Bag} from "zation-server";

const serviceName = "MySql";

export namespace MySqlModule {

    export function build(configs: Record<string, PoolConfig> | DefaultConfig<PoolConfig>): ServiceModule<PoolConfig, MySql.Pool, {}> {
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
                    mySqlQuery : async function (this : SmallBag,query ,serviceKey : string = 'default') : Promise<{results : any,fields : MySql.FieldInfo[]}> {
                        return new Promise<{results : any,fields : MySql.FieldInfo[]}>(async (resolve, reject) =>
                        {
                            (await this.getService<MySql.Pool>(serviceName,serviceKey)).
                            query(query,(error, results : any, fields : MySql.FieldInfo[]) => {
                                if(error) {reject(error);}
                                else{resolve({results : results, fields : fields});}
                            });
                        });
                    },
                    mySqlFormat : function(query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string) : string {
                        return MySql.format(query,inserts,stringifyObjects,timeZone);
                    },
                    getMySql : async function(this : SmallBag,serviceKey : string = 'default') : Promise<MySql.Pool>
                    {
                        return await this.getService<MySql.Pool>(serviceName,serviceKey);
                    },
                    isMySql : function (this : SmallBag,serviceKey : string = 'default') : boolean
                    {
                        return this.isService(serviceKey,serviceKey);
                    }
                },
                bag : {}
            }
        };
    }

}

interface DefaultConfig<T> {
    default?: T;
}

declare module 'zation-server' {
    export interface SmallBag {
        // noinspection JSUnusedGlobalSymbols
        /**
         * @description
         * Is for an mysql query.
         * Throws an ServiceNotFoundError if the service is not found.
         * @example
         * const res = mySqlQuery('SELECT 1 + 1 AS solution');
         * const solution = res.results[0];
         * @throws ServiceNotFoundError
         * @param  query
         * @param  serviceKey
         * the key to the service.
         * @return Promise<object>
         * The object has 2 fields, one for the result 'result' and one for the fields information 'fields'.
         */
        mySqlQuery: (query, serviceKey ?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>

        // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
        /**
         * @description
         * Format an mySql query.
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
         * Returns this service, if it exist otherwise it will throw an ServiceNotFoundError error.
         * @throws ServiceNotFoundError
         * @param  serviceKey
         * the key to the service.
         */
        getMySql(serviceKey ?: string): Promise<MySql.Pool>

        // noinspection JSUnusedGlobalSymbols
        /**
         * @description
         * Checks if the service with this key is exist and can be used.
         * @param  serviceKey
         * the key to the service.
         */
        isMySql(serviceKey ?: string): boolean
    }
    export interface Bag {
        // noinspection JSUnusedGlobalSymbols
        /**
         * @description
         * Is for an mysql query.
         * Throws an ServiceNotFoundError if the service is not found.
         * @example
         * const res = mySqlQuery('SELECT 1 + 1 AS solution');
         * const solution = res.results[0];
         * @throws ServiceNotFoundError
         * @param  query
         * @param  serviceKey
         * the key to the service.
         * @return Promise<object>
         * The object has 2 fields, one for the result 'result' and one for the fields information 'fields'.
         */
        mySqlQuery: (query, serviceKey ?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>

        // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
        /**
         * @description
         * Format an mySql query.
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
         * Returns this service, if it exist otherwise it will throw an ServiceNotFoundError error.
         * @throws ServiceNotFoundError
         * @param  serviceKey
         * the key to the service.
         */
        getMySql(serviceKey ?: string): Promise<MySql.Pool>

        // noinspection JSUnusedGlobalSymbols
        /**
         * @description
         * Checks if the service with this key is exist and can be used.
         * @param  serviceKey
         * the key to the service.
         */
        isMySql(serviceKey ?: string): boolean
    }
}

