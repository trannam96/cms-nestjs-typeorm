import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { FindConditions } from 'typeorm';
import { UserResDto } from './dto/user-res.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(options?: FindConditions<User>) {
    return await this.userRepository.findOne(options);
  }

  async create(user: CreateUserDto): Promise<User> {
    const userDb = await this.userRepository.findOne({ email: user.email });
    if (userDb) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const newUser = new User(user);
    return await this.userRepository.save(newUser);
  }

  async login(login: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      email: login.email,
      isActive: true,
    });
    if (!user) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    const isPass = await user.comparePassword(login.password);
    if (!isPass) throw new HttpException('Password not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, userDto: UpdateUserDto): Promise<UserResDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updateUser = await this.userRepository.save({ ...user, ...userDto });

    return plainToClass(UserResDto, updateUser, { excludeExtraneousValues: true });
  }
}
