import { Exclude, Expose } from 'class-transformer';

export class UserProfileDto {
  username: string;

  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
