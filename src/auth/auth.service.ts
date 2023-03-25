import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { User } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
  private getJwtToken(userId: string) {
    const token = this.jwtService.sign({ id: userId });
    return token;
  }
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
  }
  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException(`Email or password is incorrect`);
    }
    const token = this.getJwtToken(user.id);
    return { token, user };
  }

  async revalidateToken(user: User): Promise<AuthResponse> {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive) throw new UnauthorizedException('User is not active');
    delete user.password;
    return user;
  }
}
