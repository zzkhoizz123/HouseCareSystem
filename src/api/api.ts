import { Router } from "express";

import { router as v1 } from "api/v1/v1";

const router = Router();

router.use("/v1", v1);

export { router };
