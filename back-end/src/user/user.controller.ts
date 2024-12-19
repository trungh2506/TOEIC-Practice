import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles(Role.Admin)
  // @Post()
  // create(@Body() createUserDto: RegisterDTO) {
  //   return this.userService.create(createUserDto);
  // }

  @Roles(Role.Admin)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }

  @Roles(Role.Admin)
  @Patch('restore/:id')
  restoreAfterSoftDelete(@Param('id') id: string) {
    return this.userService.restoreUser(id);
  }
}
