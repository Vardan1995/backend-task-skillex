import pool from '../../db/config.js';
import { generateCombinations } from '../../utils/combinationGenerator.js';

export const createCombinations = async (req, res) => {
    const { items, length } = req.body;
    // Input validation
    if (!Array.isArray(items) || !Number.isInteger(length) || length < 1) {
        return res.status(400).json({
            error: 'Invalid input parameters. Items must be an array and length must be a positive integer.'
        });
    }

    // Validate each item in the array is a positive number
    if (!items.every(item => Number.isInteger(item) && item > 0)) {
        return res.status(400).json({
            error: 'All items must be positive integers.'
        });
    }

    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Store the response first
        const [responseResult] = await connection.execute(
            'INSERT INTO responses (input_array, combination_length) VALUES (?, ?)',
            [JSON.stringify(items), length]
        );
        const responseId = responseResult.insertId;

        // Generate combinations
        const { combinations, itemCodes } = generateCombinations(items, length);


        // Store individual items if they don't exist
        await Promise.all(itemCodes.map((item) => {
            return connection.execute(
                'INSERT IGNORE INTO items (item_code) VALUES (?)',
                [item]
            )
        }))

        // Store each combination
        await Promise.all(combinations.map(combination => {
            return connection.execute(
                'INSERT INTO combinations (response_id, item_combination) VALUES (?, ?)',
                [responseId, JSON.stringify(combination)]
            );
        }))

        // Commit transaction
        await connection.commit();

        // Send response
        res.json({
            id: responseId,
            combinations: combinations
        });

    } catch (error) {
        // Rollback transaction on error
        if (connection) {
            await connection.rollback();
        }
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });

    } finally {
        // Release connection back to the pool
        if (connection) {
            connection.release();
        }
    }
}