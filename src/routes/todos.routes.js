const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAllTodos, addTodo, editTodo, deleteTodo } = require('../controllers/todos.controller');

const router = express.Router();

router.get('/', authenticate, getAllTodos);
router.post('/', authenticate, addTodo);
router.patch('/:id', authenticate, editTodo); //complete or uncomplete todo
router.delete('/:id', authenticate, deleteTodo);

module.exports = router;
