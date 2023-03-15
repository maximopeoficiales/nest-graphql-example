import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, { description: "Hola mundo es lo que retorna" })
  sayHelloWorld(): string {
    return 'Hello World!';
  }

  @Query(() => Float, { description: "Retorna un numero aleatorio" })
  getRamdomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int, { description: "Desde cero a argumento a predeterminado(6)" })
  getRamdomFromZeroTo(
    @Args({ name: "to", type: () => Int, nullable: true, }) to: number = 6
  ): number {
    return Math.floor(Math.random() * to);
  }
}
