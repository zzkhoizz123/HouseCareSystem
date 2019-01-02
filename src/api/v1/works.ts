import { Router } from "express";
import * as bodyParser from "body-parser";
import * as WorkModel from "models/WorkModel";

import { factory } from "config/LoggerConfig";
const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const router = Router();
router.use(bodyParser.json());

router.post("/", (req, res) => {
  const typeList = req.body.type;
  const description = req.body.description;
  const time = req.body.time;
  const timespan = req.body.timespan;
  const location = req.body.location;
  const salary = req.body.salary;
  const userId = req.user.id;

  WorkModel.CreateWork(
    userId,
    typeList,
    time,
    timespan,
    salary,
    location,
    description
  )
    .then(data => {
      res.status(200);
      return res.json({
        message: "Successfully create a new Work",
        success: true,
        error: 0,
        data
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

router.put("/:workId", (req, res) => {
  // helper: update helper in work
  // owner: update work info
  const workId = req.params.workId;
  const userId = req.user.id;
  const userRole = req.user.role;

  WorkModel.ChooseWork(userId, userRole, workId)
    .then(work => {
      res.status(200);
      return res.json({
        message: "Successfully choose work",
        success: true,
        error: 0,
        data: {
          work
        }
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

router.get("/", (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  WorkModel.GetWorkingListOfUser(userId, userRole)
    .then(data => {
      res.status(200);
      return res.json({
        message: "Get Work success",
        success: true,
        error: 0,
        data
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

router.get("/pending", (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  WorkModel.GetWorkList({
    time: { $gt: Date.now() },
    helper: null
  })
    .then(data => {
      res.status(200);
      return res.json({
        message: "Get Work success",
        success: true,
        error: 0,
        data
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

export { router };
