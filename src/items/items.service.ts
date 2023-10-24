import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>,
  ) {}
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.repository.create({ ...createItemInput, user });
    await this.repository.save(newItem);
    return newItem;
  }

  async findAll(user: User): Promise<Item[]> {
    // TODO: filtrar,paginar, por usuario
    return await this.repository.find({
      where: {
        id: user.id,
      },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.repository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item not found with id: ${id}`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User) {
    await this.findOne(id, user);
    const item = await this.repository.preload({ ...updateItemInput, id });
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);
    await this.repository.save(item);
    return item;
  }

  async remove(id: string, user: User) {
    const findItem = await this.findOne(id, user);
    const deleteResult = await this.repository.delete({
      id: findItem.id,
    });
    return deleteResult.affected > 0;
  }
}
