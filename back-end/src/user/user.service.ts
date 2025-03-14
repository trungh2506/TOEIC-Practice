import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { paginate } from 'src/common/pagination/pagination.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: RegisterDTO) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const projection = {};
    const filter = {};
    const users = await paginate(
      this.userModel,
      paginationDto,
      filter,
      projection,
    );

    return users;
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async softDelete(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.meta_data.is_deleted = true;
    user.meta_data.deleted_at = new Date();
    await user.save();
    return user;
  }

  async restoreUser(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.meta_data.is_deleted = false;
    user.meta_data.updated_at = new Date();
    await user.save();
    return user;
  }
}
