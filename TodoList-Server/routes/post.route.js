import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await db.posts.find().skip(skip).limit(limit).toArray();
  const totalPost = await db.posts.countDocuments();
  const totalPages = Math.ceil(totalPost / limit);

  res.json({
    data: posts,
    pagination: {
      totalItems: totalPost,
      limit,
      currentPage: page,
      totalPages,
    },
  });
});

// Get single by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const existingPost = await db.posts.findOne({ _id: new ObjectId(id) });

  if (!existingPost) {
    return res.json({
      message: 'Post not found',
    });
  }

  res.json(existingPost);
});

// Create
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({
      message: 'Missing required keys',
    });
  }

  const newPost = {
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.posts.insertOne(newPost);

  res.status(201).json({
    message: 'Created successfully',
  });
});

// Update
router.put('/:id', async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const existingPost = await db.posts.findOne({ _id: new ObjectId(id) });

  if (!existingPost) {
    return res.status(400).json({
      message: 'Post not found',
    });
  }

  const updatedFields = {
    ...(title && { title }),
    ...(description && { description }),
  };

  await db.posts.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: updatedFields,
    }
  );

  return res.json({
    message: 'Update post successfully',
  });
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const existingPost = await db.posts.findOne({ _id: new ObjectId(id) });

  if (!existingPost) {
    return res.status(400).json({
      message: 'Post not found',
    });
  }

  await db.posts.deleteOne({ _id: new ObjectId(id) });
  return res.json({ data: 'Delete successfully' });
});

export default router;

/*
  ?page=1&limit=10
  totalItems = 26
  limit = 10

  => totalPages = 3
    => page 1-> 1-10
    => page 2-> 11-20
    => page 3-> 21-26

  (page - 1)*limit = 0
  page =2 => (2 - 1)*10 = 10 => 10 -> 20
  page =3 => (3 - 1)*10 = 20 => 20 -> 30
*/
