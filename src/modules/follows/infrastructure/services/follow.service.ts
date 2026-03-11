import { Injectable } from '@nestjs/common';
import { FollowRepository } from '../../domain/repositories/follows.repository';
import { FollowEntity } from '../../domain/entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  public async createFollow(follow: FollowEntity) {
    await this.followRepository.followUser(follow);
  }

  public async getUserFollowers(id: string): Promise<FollowEntity[]> {
    const res = await this.followRepository.getUserFollowers(id)
    return res ? res : []
  }

  public async getUserFollowed(id: string): Promise<FollowEntity[]> {
    const res = await this.followRepository.getUserFollows(id)
    return res ? res : []
  }

  public async removeUserFollowed(idFollower: string, idFollowed: string) {
    const follow = await this.followRepository.getFollow(idFollower, idFollowed)
    const res = await this.followRepository.unfollowUser(follow)
  }

  public async getUserFollowerList(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]> {
    return await this.followRepository.getUserFollower(idUser, page, pageSize)
  }

  public async getUserFollowingList(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]> {
    return await this.followRepository.getUserFollowing(idUser, page, pageSize)
  }

}
