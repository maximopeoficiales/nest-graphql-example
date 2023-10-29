import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchArgs } from 'src/common/dto/args';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Array<Item>> {
    // TODO: filtrar,paginar, por usuario
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }
    return await queryBuilder.getMany();
    // return await this.repository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: { id: user.id },
    //     name: Like(`%${search.toLowerCase()}%`),
    //   },
    // });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item not found with id: ${id}`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User) {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload({ ...updateItemInput, id });
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);
    await this.itemsRepository.save(item);
    return item;
  }

  async remove(id: string, user: User) {
    const findItem = await this.findOne(id, user);
    const deleteResult = await this.itemsRepository.delete({
      id: findItem.id,
    });
    return deleteResult.affected > 0;
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({
      where: { user: { id: user.id } },
    });
  }
}
