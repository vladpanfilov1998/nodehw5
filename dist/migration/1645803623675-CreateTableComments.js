"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.CreateTableComments1645803623675 = void 0;
const typeorm_1 = require("typeorm");

class CreateTableComments1645803623675 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'text',
                    type: 'varchar',
                    width: 255,
                    isNullable: false,
                },
                {
                    name: 'like',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'dislike',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'authorId',
                    type: 'int',
                },
                {
                    name: 'postId',
                    type: 'int',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()',
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['authorId'],
                    referencedTableName: 'Users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                {
                    columnNames: ['postId'],
                    referencedTableName: 'Posts',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
            ],
        }), true);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE IF EXISTS Comments
        `);
    }
}

exports.CreateTableComments1645803623675 = CreateTableComments1645803623675;