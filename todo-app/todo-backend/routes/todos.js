const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const todos = await getAsync('added_todos');
  await setAsync('added_todos', Number.parseInt(todos) + 1)

  res.send(todo);
});

router.get('/statistics', async (_, res) => {
  let todos = await getAsync('added_todos')
  console.log(todos)
  if (!todos) {
     await setAsync('added_todos', 0)
     todos = 0;
  }
  res.send({
    'added_todos': Number.parseInt(todos)
  })
});


const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.todo._id, req.body, {new: true})
  console.log(todo)
  res.send(todo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
