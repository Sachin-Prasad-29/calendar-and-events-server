const { createHttpError } = require('../errors/custom-error');
const Todo = require('../models/Todo');

const getAllTodosSvc = async (userEmail) => {
    try {
        const allTodos = await Todo.find({ createdBy: userEmail });
        if (!allTodos) {
            const error = createHttpError(`No Todo Found `, 400);
            throw error;
        }
        return allTodos;
    } catch (error) {
        throw error;
    }
};
const addTodoSvc = async (todoDetails) => {
    try {
        const insertedTodo = await Todo.create(todoDetails);
        if (!insertedTodo) {
            const error = createHttpError(`Bad Request`, 400);
            throw error;
        }
        return insertedTodo;
    } catch (error) {
        if ((error.name = 'ValidationError')) {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type Error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        throw error;
    }
};
const editTodoSvc = async (todoId, todoDetails) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate({ _id: todoId }, todoDetails, {
            new: true,
            runValidators: true,
        });
        if (!updatedTodo) {
            const error = createHttpError('No Todo Found with Given Id', 404);
            throw error;
        }
        return updatedTodo;
    } catch (error) {
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        if (error.type === 'NotFound') {
            throw error;
        }
        throw error;
    }
};
const deleteTodoSvc = async (todoId) => {
    const deletedTodoDetails = await Todo.findByIdAndDelete({ _id: todoId });
    if (!deletedTodoDetails) {
        const error = createHttpError(`No Todo Found with Given Id`, 404);
        throw error;
    }
    return deletedTodoDetails;
};

module.exports = { getAllTodosSvc, addTodoSvc, editTodoSvc, deleteTodoSvc };
