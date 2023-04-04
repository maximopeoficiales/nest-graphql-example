import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusArgs } from './dto/args/status.args';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Todo 1', done: true },
    { id: 2, description: 'Todo 2', done: false },
    { id: 3, description: 'Todo 3', done: true },
  ];

  getTotalTodos(): number {
    return this.todos.length;
  }

  getCompletedTodos(): number {
    return this.todos.filter((todo) => todo.done).length;
  }
  getPendingTodos(): number {
    return this.todos.filter((todo) => !todo.done).length;
  }

  findAll(statusArgs: StatusArgs): Todo[] {
    const { status } = statusArgs;
    if (status !== undefined) {
      return this.todos.filter((todo) => todo.done === status);
    }
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`Todo with id: ${id} not found`);
    return todo;
  }

  createTodo(createTodoInput: CreateTodoInput): Todo {
    const todo = { ...createTodoInput, done: false, id: this.todos.length + 1 };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id, updateTodoInput: UpdateTodoInput): Todo {
    const { done, description } = updateTodoInput;
    const todoToUpdate = this.findOne(id);
    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo) => {
      return todo.id === id ? todoToUpdate : todo;
    });

    return todoToUpdate;
  }

  deleteTodo(id: number): boolean {
    const todo = this.findOne(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}
