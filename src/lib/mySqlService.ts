/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import MySql                          = require("mysql");
import {ServicePackage,DefaultInstance} from "zation-service";
import {PoolConfig}                     from "mysql";
import {serviceName}                    from "./constants";

export namespace MySqlService {

    /**
     * This build function creates a mySql service package with
     * the provided instances configuration.
     * You can use this package in the service config.
     * @example
     * export default Config.serviceConfig({
     *     ...MySqlService.build({
     *         default: {
     *             port: 3306,
     *             database: 'MyFirstDatabase',
     *             user: process.env.DB_USER,
     *             password: process.env.DB_PASSWORD,
     *             charset: 'utf8mb4_unicode_ci'
     *         },
     *         secondDb: {
     *             port: 3307,
     *             database: 'MySecondDatabase',
     *             user: process.env.DB_SECOND_USER,
     *             password: process.env.DB_SECOND_PASSWORD,
     *             charset: 'utf8mb4_unicode_ci'
     *         }
     *    })
     * });
     * @param instances
     */
    export function build(instances: Record<string, PoolConfig> | DefaultInstance<PoolConfig>): ServicePackage<PoolConfig,MySql.Pool,MySql.Connection> {
        return {
            [serviceName] : {
                create: async (c: PoolConfig): Promise<MySql.Pool> => {
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
                },
                instances
            }
        };
    }
}