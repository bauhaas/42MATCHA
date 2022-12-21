import pool from '../config/db.js';
import log from '../config/log.js';

// Insert a new block into the database
export const insertBlock = async (blocker_id, blocked_id) => {
    try {
        const client = await pool.connect();
        const id = await client.query(`
        INSERT INTO blocks(blocker_id, blocked_id)
        VALUES($1, $2)
        RETURNING id
        `, [blocker_id, blocked_id]);

        log.info("block", id, "created");

        client.release();
        return id;
    } catch (err) {
        log.error('[blockService]', err);
        throw err;
    }
};


// Get all Blocks of blocker_id from the database
export const getBlocksOfUser = async (blocker_id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM blocks
        WHERE blocker_id = $1`, [blocker_id]);

        client.release();
        return result.rows;
    } catch (err) {
        throw err;
    }
};

// Get all Blocks of blocker_id from the database
export const getBlockedUsersByBlockerId = async (blocker_id) => {
    try {
        log.info('[blockService]', blocker_id);
        const client = await pool.connect();

        // This query performs an inner join between the blocks and users tables on the
        // blocked_id column of the blocks table and the id column of the users table.
        // It selects the id, first_name, and last_name columns from the users table for each blocked user,
        // and filters the results by the blocker_id column of the blocks table.
        const result = await client.query(`
        SELECT b.id, b.blocked_id, u.first_name, u.last_name
        FROM blocks b
        INNER JOIN users u ON b.blocked_id = u.id
        WHERE b.blocker_id = $1
      `, [blocker_id]);
        client.release();
        return result.rows;
    } catch (err) {
        throw err;
    }
};


// Delete a block from the database
export const deleteBlock = async (blocker_id, blocked_id) => {
    try {
        log.info('[blockService]', blocker_id, blocked_id);
        const client = await pool.connect();
        await client.query(`DELETE FROM blocks
                            WHERE blocker_id = $1
                            AND blocked_id = $2`,
        [blocker_id, blocked_id]);
        client.release();
    } catch (err) {
        throw err;
    }
};
