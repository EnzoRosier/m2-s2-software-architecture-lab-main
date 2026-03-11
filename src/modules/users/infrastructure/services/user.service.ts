import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getModsAdmins(): Promise<UserEntity[]> {
    return await this.userRepository.listModsAdmins();
  }

  public async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new UserNotFoundException()
    }
    return user;
  }
}
