// src/api/todos.js
import api from './index';

export const getTodos = (date) =>
  api.get('/api/todos', { params: { date } });

export const addTodo = (content, date) =>
  api.post('/api/todos', { content, date });

export const startTodo = (id) =>
  api.patch(`/api/todos/${id}/start`);

export const completeTodo = (id, duration) =>
  api.patch(`/api/todos/${id}/complete`, { duration });

export const deleteTodo = (id) =>
  api.delete(`/api/todos/${id}`);
