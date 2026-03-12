import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { FollowService } from 'src/modules/follows/infrastructure/services/follow.service';
import { GetUserFollowerDto } from '../dtos/get-user-follower.dto';
import { FollowDto } from '../dtos/get-follow-user.dto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { GetUserFollowingDto } from '../dtos/get-user-following.dto';

@Injectable()
export class GetUserFollowingUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followService: FollowService,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, page: number, pageSize: number): Promise<GetUserFollowingDto> {

    const follows = await this.followService.getUserFollowingList(id, page, pageSize);

    let res = new GetUserFollowingDto()
    res.following = []
    res.page = page;
    res.pageSize = pageSize;
    res.total = follows.length
    for(const follow of follows ) {
      let i = new FollowDto()
      const user = await this.userRepository.getUserById(follow.followedId)
      if (!user) {
        throw new UserNotFoundException()
      }
      i.followedAt = follow.followedAt;
      i.username = user.username.toString()
      i.id = follow.id
      i
      res.following.push(i)
    }

    return res;

  }
}
