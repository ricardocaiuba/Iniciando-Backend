import { Router } from "express";
import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import providersRouter from "@modules/appointments/infra/http/routes/providers.routes";
import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sesionsRouter from "@modules/users/infra/http/routes/sessions.routes";
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import profilerRouter from "@modules/users/infra/http/routes/profile.routes";

const routes = Router();

routes.use("/appointments", appointmentsRouter);
routes.use("/providers", providersRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sesionsRouter);
routes.use("/password", passwordRouter);
routes.use("/profile", profilerRouter);

export default routes;
