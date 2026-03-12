import { FollowDto } from "./get-follow-user.dto";

export class GetUserFollowerDto {
  followers: FollowDto[];
  total: number;
  page: number;
  pageSize: number;
}
