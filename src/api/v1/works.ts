import { Router } from "express";
import * as bodyParser from "body-parser";
import * as WorkModel from "models/WorkModel";
import RequestError from "utils/RequestError";

import logger from "utils/logger";

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

router.post("/contractAddress", (req, res, next)=>{
  const workId = req.body.workId;
  const contractAddress = req.body.contractAddress;

  if (!workId || !contractAddress){
    next(new RequestError(0, "Missing required field", 200));
  }

  WorkModel.AddContractAddress(workId, contractAddress)
    .then(result=>{
      res.status(200);
      return res.json({
        message: "Success Add contract address",
        success: true,
        error: 0,
        data: result
      });
    })
    .catch(msg=>{
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

export { router };
