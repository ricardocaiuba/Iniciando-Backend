import path from "path";
import fs from "fs";
import uploadonfig from "@config/upload";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import User from "../infra/typeorm/entities/User";

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,

    @inject("StorageProvider") private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Only authenticated users can change avatar!", 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = avatarFileName;
    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
