import express, {Request, Response} from 'express';
import 'reflect-metadata';
import {createConnection, getManager} from 'typeorm';
import {User} from './entity/user.entity';
import {Post} from './entity/post.entity';
import {Comment} from './entity/comment.entity';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/users', async (req: Request, res: Response) => {
    const users = await getManager()
        .getRepository(User)
        .find();
    res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
    console.log(req.body);
    const createdUser = await getManager()
        .getRepository(User)
        .save(req.body);
    res.json(createdUser);
});

app.patch('/users/:id', async (req: Request, res: Response) => {
    const {
        email,
        password,
    } = req.body;
    const {id} = req.params;
    const updatedUser = await getManager()
        .getRepository(User)
        .update({id: Number(id)}, {
            password,
            email,
        });
    res.json(updatedUser);
});

app.delete('/users/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    const deletedUser = await getManager()
        .getRepository(User)
        .delete({id: Number(id)});
    res.json(deletedUser);
});

app.post('/posts', async (req: Request, res: Response) => {
    try {
        const createdPost = await getManager().getRepository(Post).save(req.body);
        res.json(createdPost);
    } catch (e) {
        console.log(e);
    }
});

app.get('/posts/:userId', async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await getManager().getRepository(Post)
            .createQueryBuilder('post')
            .where('post.userId = :id', {id: Number(id)})
            .leftJoin('User', 'user', 'user.id = post.userId')
            .getMany();
        res.json(user);
    } catch (e) {
        console.log(e);
    }
});

app.put('/posts/:postId', async (req: Request, res: Response) => {
    try {
        const {title, text} = req.body;
        const {id} = req.params;
        const updatedPost = await getManager()
            .getRepository(Post)
            .update({id: Number(id)}, {title, text});
        res.json(updatedPost);
    } catch (e) {
        console.log(e);
    }
});

app.post('/comments', async (req, res) => {
    try {
        const createdComment = await getManager().getRepository(Comment).save(req.body);
        res.status(201).json(createdComment);
    } catch (e) {
        console.log(e);
    }
});

app.get('/comments/:userId', async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const comments = await getManager().getRepository(Comment)
            .createQueryBuilder('comment')
            .where('comment.authorId = :id', {id: Number(id)})
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.post', 'post')
            .getMany();
        res.json(comments);
    } catch (e) {
        console.log(e);
    }
});

app.post('/comments/action', async (req: Request, res: Response) => {
    try {
        const {action, commentId} = req.body;
        const queryRunner = getManager().getRepository(Comment);
        const comment = await queryRunner.createQueryBuilder('comment')
            .where('comment.id = :id', {id: commentId})
            .getOne();

        if (!comment) {
            throw new Error('wrong comment ID');
        }

        console.log(commentId);

        if (action === 'like') {
            await queryRunner.update({id: commentId}, {like: comment.like + 1});
        }
        if (action === 'dislike') {
            await queryRunner.update({id: commentId}, {dislike: comment.dislike + 1});
        }

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
    }
});

app.listen(4000, async () => {
    console.log('Server has started on port 4000!!!');
    try {
        const connection = await createConnection();
        if (connection) {
            console.log('DB connected');
        }
    } catch (e) {
        if (e) console.log(e);
    }
});