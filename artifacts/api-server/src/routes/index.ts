import { Router, type IRouter } from "express";
import healthRouter from "./health";
import restaurantsRouter from "./restaurants";
import menuRouter from "./menu";

const router: IRouter = Router();

router.use(healthRouter);
router.use(restaurantsRouter);
router.use(menuRouter);

export default router;
