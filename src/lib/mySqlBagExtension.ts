/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import MySql                = require("mysql");
import {registerBagExtension} from "zation-bag-extension";
import {Bag}                  from "zation-server";
import {serviceName}          from "./constants";

interface BagExtension
{
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can make a simple promise based
     * MySQL query by using one of your service instances.
     * Throws a ServiceNotFoundError error if the service instance is not found.
     * @example
     * const res = await mySqlQuery('SELECT 1 + 1 AS solution');
     * const solution = res.results[0];
     * @throws ServiceNotFoundError
     * @param query
     * @param instanceName Default: 'default'
     * @return Promise<object>
     * The object has 2 fields, one for the result 'result' and one for the fields information 'fields'.
     */
    mySqlQuery: (query: string, instanceName?: string) => Promise<{ results: any, fields: MySql.FieldInfo[] }>

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
     * Returns the MySQL service instance, if it exists otherwise,
     * it will throw a ServiceNotFoundError error.
     * @throws ServiceNotFoundError
     * @param instanceName Default: 'default'
     */
    getMySql(instanceName?: string): Promise<MySql.Pool>

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function returns a boolean that indicates if the MySQL
     * service instance exists.
     * @param instanceName Default: 'default'
     */
    hasMySql(instanceName?: string): boolean
}

declare module 'zation-server' {
    export interface Bag extends BagExtension {}
    export interface RequestBag extends BagExtension {}
}

registerBagExtension({
    name: serviceName,
    bag: {
        mySqlQuery: async function (this: Bag,query ,instanceName: string = 'default'): Promise<{results: any,fields: MySql.FieldInfo[]}> {
            return new Promise<{results: any,fields: MySql.FieldInfo[]}>(async (resolve, reject) => {
                (await this.getService<MySql.Pool>(serviceName,instanceName)).
                query(query,(error, results: any, fields: MySql.FieldInfo[]) => {
                    error ? reject(error) : resolve({results, fields});
                });
            });
        },
        mySqlFormat: function(query: string, inserts: any[], stringifyObjects?: boolean, timeZone?: string): string {
            return MySql.format(query,inserts,stringifyObjects,timeZone);
        },
        getMySql: async function(this: Bag,instanceName: string = 'default'): Promise<MySql.Pool> {
            return this.getService<MySql.Pool>(serviceName,instanceName);
        },
        hasMySql: function (this: Bag,instanceName: string = 'default'): boolean {
            return this.hasService(serviceName,instanceName);
        }
    } as BagExtension
});
