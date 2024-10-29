import pool from './config.js';

/**
 * Initializes the database schema by creating necessary tables if they don't exist.
 * Creates three tables:
 * - items: Stores unique item codes
 * - responses: Stores input arrays and their combination lengths
 * - combinations: Stores item combinations linked to responses
 * 
 * Table Relationships:
 * - combinations.response_id references responses.id (Many-to-One)
 * 
 * @async
 * @throws {Error} If database initialization fails
 * @returns {Promise<void>}
 */
export async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create items table with unique constraint on item_code
        await connection.query(`
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_code VARCHAR(10) NOT NULL,
                UNIQUE KEY unique_item_code (item_code)
            );
        `);

        // Create responses table to store input arrays and combination lengths
        await connection.query(`
            CREATE TABLE IF NOT EXISTS responses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                input_array JSON NOT NULL,
                combination_length INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create combinations table with foreign key constraint and cascade delete
        await connection.query(`
            CREATE TABLE IF NOT EXISTS combinations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                response_id INT NOT NULL,
                item_combination JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (response_id)
                    REFERENCES responses(id)
                    ON DELETE CASCADE
            );
        `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}
