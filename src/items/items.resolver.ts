import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { User } from 'src/users/entities/user.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Array<Item>> {
    return await this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.update(
      updateItemInput.id,
      updateItemInput,
      user,
    );
  }

  @Mutation(() => Boolean)
  async removeItem(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.itemsService.remove(id, user);
  }
}
