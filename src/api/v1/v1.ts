import { Router } from "express";

import { router as user } from "api/v1/users";
import { router as work } from "api/v1/works";

const router = Router();

router.use("/users", user);
router.use("/works", work);

export { router };
