import { Router } from "express";
import * as bodyParser from "body-parser";
import * as moment from "moment";

import * as WorkModel from "models/WorkModel";
import RequestError from "utils/RequestError";
import ConvertDate from "utils/ConvertDate";

import logger from "utils/logger";

const router = Router();
router.use(bodyParser.json());

/**
 * POST: /
 *     @param typeList:      array<string>, Compulsory, ["1", "2"]
 *     @param description:   string, Optional, "have responsibility"
 *     @param time:          string, Compulsory, "10/10/2019"
 *     @param timespan:      number, Compulsory, 10, day
 *     @param location:      string, Compulsory, "hi street"
 *     @param salary:        string, Compulsory, "10000000", vnd
 */
router.post("/", (req, res, next) => {
  const typeList = req.body.type;
  const description = req.body.description;
  const time = req.body.time;
  const timespan = req.body.timespan;
  const location = req.body.location;
  const salary = req.body.salary;
  const userId = req.user.id;

  if (!typeList || !salary || !timespan || !time || !location) {
    next(new RequestError(0, "Missing required fields", 200));
    return;
  }

  if (moment(time).isSameOrBefore(moment())) {
    next(new RequestError(0, "Error time", 200));
    return;
  }

  WorkModel.CreateWork(
    userId,
    typeList,
    moment(time).valueOf(),
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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * PUT: /:workId
 */
router.put("/:workId", (req, res, next) => {
  // helper: update helper in work
  // owner: update work info
  const workId = req.params.workId;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!workId || !userId || !userRole) {
    next(new RequestError(0, "Missing required fields", 200));
    return;
  }

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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * Get: /
 */
router.get("/", (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!userId || !userRole) {
    next(new RequestError(0, "Missing required fields", 200));
    return;
  }

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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * GET: /pending
 */
router.get("/pending", (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!userId || !userRole) {
    next(new RequestError(0, "Missing required fields", 200));
    return;
  }
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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * POST: /contractAddress
 *     @param workId              string, Compulsory
 *     @param contractAddress:    string, Compulsory, "111111"
 */
router.post("/contractAddress", (req, res, next) => {
  const workId = req.body.workId;
  const contractAddress = req.body.contractAddress;

  if (!workId || !contractAddress) {
    next(new RequestError(0, "Missing required field", 200));
    return;
  }

  WorkModel.AddContractAddress(workId, contractAddress)
    .then(result => {
      res.status(200);
      return res.json({
        message: "Success Add contract address",
        success: true,
        error: 0,
        data: result
      });
    })
    .catch(msg => {
      next(new RequestError(0, msg, 200));
      return;
    });
});

export { router };
