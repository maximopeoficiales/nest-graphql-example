import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService
  ) {
  }

  @Query(() => [Todo], { name: "todos" })
  findAll(): Todo[] {
    return this.todoService.findAll()
  }
  @Query(() => Todo, { name: "todo" })
  findOne(
    @Args({ name: "id", type: () => Int }) id: number
  ): Todo {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo, { name: "createTodo" })
  createTodo(
    @Args({ name: "createTodoInput" }) createTodoInput: CreateTodoInput
  ): Todo {
    return this.todoService.createTodo(createTodoInput);
  }

  @Mutation(() => Todo, { name: "updateTodo" })
  updateTodo(
    @Args({ name: "updateTodoInput" }) updateTodoInput: UpdateTodoInput
  ) {
    return this.todoService.updateTodo(updateTodoInput);
  }

  @Mutation(() => Boolean, { name: "deleteTodo" })
  removeTodo(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.todoService.deleteTodo(id);
  }
}
