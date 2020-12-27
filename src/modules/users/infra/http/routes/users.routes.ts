import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";
import { container } from "tsyringe";

import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFileName: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  }
);

export default usersRouter;
