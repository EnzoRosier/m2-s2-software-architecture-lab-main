import { FollowDto } from "./get-follow-user.dto";

export class GetUserFollowingDto {
  following: FollowDto[]
  total: number;
  page: number;
  pageSize: number;
}
