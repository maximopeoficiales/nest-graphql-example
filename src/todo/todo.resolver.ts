import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatusArgs } from './dto/args/status.args';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { AgreggationsType } from './types/agreggations.type';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService
  ) {
  }

  @Query(() => Int, { name: "totalTodos" })
  getTotalTodos(): number {
    return this.todoService.getTotalTodos();
  }

  @Query(() => Int, { name: "completedTodos" })
  getCompletedTodos(): number {
    return this.todoService.getCompletedTodos();
  }

  @Query(() => Int, { name: "pendingTodos" })
  getPendingTodos(): number {
    return this.todoService.getPendingTodos();
  }

  @Query(() => [Todo], { name: "todos" })
  findAll(
    @Args() statusArgs: StatusArgs
  ): Todo[] {
    return this.todoService.findAll(statusArgs)
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
    return this.todoService.updateTodo(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Boolean, { name: "deleteTodo" })
  removeTodo(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.todoService.deleteTodo(id);
  }

  @Query(() => AgreggationsType, { name: "agreggations" })
  agreggations(): AgreggationsType {
    return {
      completed: this.todoService.getCompletedTodos(),
      pending: this.todoService.getPendingTodos(),
      total: this.todoService.getTotalTodos()
    }
  }
}
