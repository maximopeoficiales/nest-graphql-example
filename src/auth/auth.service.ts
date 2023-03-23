import { Injectable, BadRequestException } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService
  ) { }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    console.log(signupInput);
    const user = await this.usersService.create(signupInput)
    const token = "token_test"
    return {
      token,
      user
    }
  }
  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Email or password is incorrect`);
    }
    const token = "token_test";
    return { token, user };
  }
}
