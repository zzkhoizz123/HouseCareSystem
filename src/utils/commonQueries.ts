import * as moment from "moment";

const queryToday = () => {   
  const today = moment().toDate();
  const tomorow = moment().add(1, "days").toDate();
  return { time: { $and: [{$gte: today}, {$lte: tomorow}] } }
}

export {
    queryToday
}