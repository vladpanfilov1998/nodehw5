"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
const post_entity_1 = require("./entity/post.entity");
const comment_entity_1 = require("./entity/comment.entity");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.get('/users', async (req, res) => {
    const users = await (0, typeorm_1.getManager)()
        .getRepository(user_entity_1.User)
        .find();
    res.json(users);
});
app.post('/users', async (req, res) => {
    console.log(req.body);
    const createdUser = await (0, typeorm_1.getManager)()
        .getRepository(user_entity_1.User)
        .save(req.body);
    res.json(createdUser);
});
app.patch('/users/:id', async (req, res) => {
    const { email, password, } = req.body;
    const { id } = req.params;
    const updatedUser = await (0, typeorm_1.getManager)()
        .getRepository(user_entity_1.User)
        .update({ id: Number(id) }, {
            password,
            email,
        });
    res.json(updatedUser);
});
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await (0, typeorm_1.getManager)()
        .getRepository(user_entity_1.User)
        .delete({ id: Number(id) });
    res.json(deletedUser);
});
app.post('/posts', async (req, res) => {
    try {
        const createdPost = await (0, typeorm_1.getManager)().getRepository(post_entity_1.Post).save(req.body);
        res.json(createdPost);
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/posts/:userId', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, typeorm_1.getManager)().getRepository(post_entity_1.Post)
            .createQueryBuilder('post')
            .where('post.userId = :id', { id: Number(id) })
            .leftJoin('User', 'user', 'user.id = post.userId')
            .getMany();
        res.json(user);
    }
    catch (e) {
        console.log(e);
    }
});
app.put('/posts/:postId', async (req, res) => {
    try {
        const { title, text } = req.body;
        const { id } = req.params;
        const updatedPost = await (0, typeorm_1.getManager)()
            .getRepository(post_entity_1.Post)
            .update({ id: Number(id) }, { title, text });
        res.json(updatedPost);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/comments', async (req, res) => {
    try {
        const createdComment = await (0, typeorm_1.getManager)().getRepository(comment_entity_1.Comment).save(req.body);
        res.status(201).json(createdComment);
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/comments/:userId', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await (0, typeorm_1.getManager)().getRepository(comment_entity_1.Comment)
            .createQueryBuilder('comment')
            .where('comment.authorId = :id', { id: Number(id) })
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.post', 'post')
            .getMany();
        res.json(comments);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/comments/action', async (req, res) => {
    try {
        const { action, commentId } = req.body;
        const queryRunner = (0, typeorm_1.getManager)().getRepository(comment_entity_1.Comment);
        const comment = await queryRunner.createQueryBuilder('comment')
            .where('comment.id = :id', { id: commentId })
            .getOne();
        if (!comment) {
            throw new Error('wrong comment ID');
        }
        console.log(commentId);
        if (action === 'like') {
            await queryRunner.update({ id: commentId }, { like: comment.like + 1 });
        }
        if (action === 'dislike') {
            await queryRunner.update({ id: commentId }, { dislike: comment.dislike + 1 });
        }
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
    }
});
app.listen(4000, async () => {
    console.log('Server has started on port 4000!!!');
    try {
        const connection = await (0, typeorm_1.createConnection)();
        if (connection) {
            console.log('DB connected');
        }
    }
    catch (e) {
        if (e)
            console.log(e);
    }
});