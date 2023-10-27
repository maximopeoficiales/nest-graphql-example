import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run seed on production');
    }

    // Limpiar la base de datos
    await this.deleteDatabase();
    // Crear Usuarios
    const user = await this.loadUsers();
    // Crear Items
    await this.loadItems(user);
    return true;
  }

  async deleteDatabase() {
    // borrar items
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    // borrar usuarios
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }
}
