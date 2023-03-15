import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: "Todo 1", done: true },
    { id: 2, description: "Todo 2", done: false },
    { id: 3, description: "Todo 3", done: true },
  ]
  findAll(): Todo[] {
    return this.todos
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) throw new NotFoundException(`Todo with id: ${id} not found`);
    return todo;
  }

  createTodo(createTodoInput: CreateTodoInput): Todo {
    const todo = { ...createTodoInput, done: false, id: this.todos.length + 1 };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(updateTodoInput: UpdateTodoInput): Todo {
    const { done, id, description } = updateTodoInput;
    const todoToUpdate = this.findOne(updateTodoInput.id);
    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map(todo => {
      return (todo.id === id) ? todoToUpdate : todo;
    });

    return todoToUpdate;
  }

  deleteTodo(id: number): Boolean {
    const todo = this.findOne(id);
    this.todos = this.todos.filter(todo => todo.id !== id);
    return true;
  }
}
