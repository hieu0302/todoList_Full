
import express  from "express";
import {db} from '../config/database.js';
import { ObjectId } from "mongodb";



const router = express.Router();
//get all todolist
router.get("/", async(req,res)=>{
   const todos = await db.todos.find().toArray();

   res.json(
     todos
   
    )

})

router.post("/", async(req,res)=>{
    const { title, complete} = req.body;

    if(!title) {
        return res.status(400).json({
            message: 'Điền đầy đủ thông tin'
        })
    } 

    const newTodos = {
        title,
        complete:false
    }

    await db.todos.insertOne(newTodos);

    res.status(201).json({
      message: 'Created successfully',
    });
})

// Update
router.put('/:id', async (req, res) => {
    const {  title } = req.body;
    const { id } = req.params;
  
    const existingPost = await db.todos.findOne({ _id: new ObjectId(id) });
  
    if (!existingPost) {
      return res.status(400).json({
        message: 'Todos not found',
      });
    }
  
    const updatedFields = {
      ...(title && { title }),
    };
  
    await db.todos.updateOne(
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
    console.log(id);
    const existingPost = await db.todos.findOne({ _id: new ObjectId(id) });
  
    if (!existingPost) {
      return res.status(400).json({
        message: 'Post not found',
      });
    }
  
    await db.todos.deleteOne({ _id: new ObjectId(id) });
    return res.json({ data: 'Delete successfully' });
  });
export default router