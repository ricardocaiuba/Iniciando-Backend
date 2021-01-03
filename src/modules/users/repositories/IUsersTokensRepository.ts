import UserToken from "@modules/users/infra/typeorm/entities/UserToken";

interface IUsersTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}

export default IUsersTokensRepository;
