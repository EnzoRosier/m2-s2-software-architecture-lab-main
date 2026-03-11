export class GetFollowUserDto {
  followers?: FollowDto[]
  following?: FollowDto[]
  total: number;
  page: number;
  pageSize: number;
}

export class FollowDto {
  id: string;
  username: string;
  followedAt: Date;
} 
