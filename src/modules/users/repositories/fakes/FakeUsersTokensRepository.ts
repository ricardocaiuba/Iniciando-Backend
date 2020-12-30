import { uuid } from "uuidv4";
//import { v4 as uuid } from "uuid";

import IUsersTokensRepository from "@modules/users/repositories/IUsersTokensRepository";
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";

import UserToken from "@modules/users/infra/typeorm/entities/UserToken";

class FakeUsersTokensRepository implements IUsersTokensRepository {
  private usersTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }
}
export default FakeUsersTokensRepository;
