let { db } = require("./nedb.js");

db.recordings.persistence.setAutocompactionInterval(10000);

function pushDataPointToSession(timestamp, data, sessionId, recordingId) {
  db.recordings.update(
    { sessionId: sessionId, recordingId: recordingId },
    /* SUGGESTION 1:
      {
        $push: {
          "data.cl": [timestamp, data.cl],
          "data.pd": [timestamp, data.pd],
          "data.fam": [timestamp, data.fam],
          "data.ipd": [timestamp, data.ipd],
          "data.pa": [timestamp, data.pa],
          "data.eng": [timestamp, data.eng],
          "data.ps": [timestamp, data.ps],
          "data.er": [timestamp, data.er],
          "data.ms": [timestamp, data.ms],
          "data.esf": [timestamp, data.esf],
        },
      },
      */

    // SUGGESTION 2:
    {
      $push: {
        "data.timestamps": timestamp,
        "data.cl": data.cl,
        "data.pd": data.pd,
        "data.fam": data.fam,
        "data.ipd": data.ipd,
        "data.pa": data.pa,
        "data.eng": data.eng,
        "data.ps": data.ps,
        "data.er": data.er,
        "data.ms": data.ms,
        "data.esf": data.esf,
      },
    },
    { multi: false, upsert: true },
    () => {}
  );
}

module.exports = {
  pushDataPointToSession: pushDataPointToSession,
};
