"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablePosts1645664356942 = void 0;
class CreateTablePosts1645664356942 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS Posts (
                id INT PRIMARY KEY AUTO_INCREMENT,  
                userId INT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                text VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT(UTC_TIMESTAMP()) NOT NULL,
                deletedAt TIMESTAMP,
                CONSTRAINT fk_user 
                    FOREIGN KEY(userId) 
                    REFERENCES Users(id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE IF EXISTS Users
        `);
    }
}
exports.CreateTablePosts1645664356942 = CreateTablePosts1645664356942;