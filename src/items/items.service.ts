import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>
  ) {
  }
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.repository.create(createItemInput);
    await this.repository.save(newItem);
    return newItem;
  }

  async findAll(): Promise<Item[]> {
    // TODO: filtrar,paginar, por usuario
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Item> {
    const findItem = await this.repository.findOne({ where: { id: id } });
    if (!findItem) throw new NotFoundException(`Item not found with id: ${id}`);
    return findItem;
  }

  async update(id: string, updateItemInput: UpdateItemInput) {
    const findItem = await this.findOne(id);
    const { name, quantity, quantityUnit } = updateItemInput;
    if (name) findItem.name = name;
    if (quantity) findItem.quantity = quantity;
    if (quantityUnit) findItem.quantityUnit = quantityUnit;
    await this.repository.save(findItem);
    return findItem;
  }

  async remove(id: string) {
    const findItem = await this.findOne(id);
    const deleteResult = await this.repository.delete(findItem);
    return deleteResult.affected > 0;
  }
}
