import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
export type DbPool = typeof pool;
export default pool;
//# sourceMappingURL=database.d.ts.map