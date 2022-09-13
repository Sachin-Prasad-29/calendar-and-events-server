const { createHttpError } = require('../errors/custom-error');

const { getAllTodosSvc, addTodoSvc, editTodoSvc, deleteTodoSvc } = require('../services/todo.service');

const getAllTodos = async (req, res, next) => {
    const userEmail = res.locals.claims.email;
    try {
        const allTodos = await getAllTodosSvc(userEmail);
        const allTodoDetails = { success: true, todos: allTodos };
        res.status(201).json(allTodoDetails);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

const addTodo = async (req, res, next) => {
    const userEmail = res.locals.claims.email;
    const todoDetails = req.body;
    todoDetails.createdBy = userEmail;

    if (Object.keys(todoDetails).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    try {
        const insertedTodo = await addTodoSvc(todoDetails);
        const todoDetail = { success: true, todos: insertedTodo };
        res.status(201).json(todoDetail);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

const editTodo = async (req, res, next) => {
    const todoId = req.params.id;
    const todoDetails = req.body;
    try {
        const updatedTodo = await editTodoSvc(todoId, todoDetails);
        const todoDetail = { success: true, todos: updatedTodo };
        res.status(201).json(todoDetail);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

const deleteTodo = async (req, res, next) => {
    const todoId = req.params.id;
    try {
        const deletedTodoDetails = await deleteTodoSvc(todoId);
        const todoDetail = { success: true, todos: deletedTodoDetails };
        res.status(201).json(todoDetail);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

module.exports = { getAllTodos, addTodo, editTodo, deleteTodo };
