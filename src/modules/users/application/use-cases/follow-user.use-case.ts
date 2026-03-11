import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CannotSelfFollow } from '../../domain/exceptions/cannot-self-follow.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { AlreadyFollowingException } from '../../domain/exceptions/already-following.exception';
import { FollowService } from 'src/modules/follows/infrastructure/services/follow.service';
import { FollowEntity } from 'src/modules/follows/domain/entities/follow.entity';
import { FollowUserDto } from '../dtos/follow-user.dto';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followService: FollowService,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<FollowUserDto> {
    this.loggingService.log('UpdateUserUseCase.execute');
    const userToFollow = await this.userRepository.getUserById(id);

    if (!userToFollow) {
      throw new UserNotFoundException();
    }

    if (!user.permissions.user.canFollow(userToFollow.id)) {
      throw new CannotSelfFollow();
    }
    const follows = await this.followService.getUserFollowed(user.id);

    const alreadyfollowing = follows.some((follow) => follow.followedId === id);
    if (alreadyfollowing) {
      throw new AlreadyFollowingException();
    }

    const follow = FollowEntity.create(user.id, id, new Date(Date.now()));
    await this.followService.createFollow(follow);
    let resFollow = new FollowUserDto();

    resFollow.followedAt = follow.followedAt;
    resFollow.followedId = follow.followedId;
    resFollow.followerId = follow.followerId;

    return resFollow;
  }
}
