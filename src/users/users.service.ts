import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/postgres-error-code.enum';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common/exceptions';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }
  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async blockUser(id: string): Promise<User> {
    throw new Error('Method not implemented.');;
  }

  private handleDBErrors(error: any) {
    this.logger.error(error);
    if (error.code === PostgresErrorCode.UniqueViolation) {
      throw new BadRequestException(error.detail.replace("key", ""));
    }
    throw new InternalServerErrorException("Please check server logs for more details");
  }
}
