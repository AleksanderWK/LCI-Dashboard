let { db } = require("./nedb.js");

db.recordings.persistence.setAutocompactionInterval(10000);

function getSessionRecording(sessionId) {
  return new Promise((resolve, reject) => {
    db.recordings.findOne({ _id: sessionId }, (err, doc) => {
      resolve(doc);
    });
  });
}

function pushDataPointToSession(timestamp, data, sessionId, recordingId) {
  db.recordings.update(
    { _id: sessionId },
    {
      $min: {
        startTime: timestamp,
      },
      $max: {
        endTime: timestamp,
      },
      $push: {
        // One array for each variable and one common timestamp array
        ["data." + recordingId + ".timestamps"]: timestamp,
        ["data." + recordingId + ".cl"]: data.cl,
        ["data." + recordingId + ".pd"]: data.pd,
        ["data." + recordingId + ".fam"]: data.fam,
        ["data." + recordingId + ".ipi"]: data.ipi,
        ["data." + recordingId + ".pa"]: data.pa,
        ["data." + recordingId + ".eng"]: data.eng,
        ["data." + recordingId + ".ps"]: data.ps,
        ["data." + recordingId + ".er"]: data.er,
        ["data." + recordingId + ".ms"]: data.ms,
        ["data." + recordingId + ".esf"]: data.esf,
        ["data." + recordingId + ".ese"]: data.ese,

        // ALTERNATIVE: One object per data point containing all variables and timestamp
        // ["data." + recordingId]: { ...data, timestamp: timestamp },

        // ALTERNATIVE: Timestamp stored for each variable data point
        /*
        "data.cl": [timestamp, data.cl],
        "data.pd": [timestamp, data.pd],
        "data.fam": [timestamp, data.fam],
        "data.ipi": [timestamp, data.ipi],
        "data.pa": [timestamp, data.pa],
        "data.eng": [timestamp, data.eng],
        "data.ps": [timestamp, data.ps],
        "data.er": [timestamp, data.er],
        "data.ms": [timestamp, data.ms],
        "data.esf": [timestamp, data.esf],
        "data.esf": [timestamp, data.ese],
        */
      },
    },
    { multi: false, upsert: true },
    () => {}
  );
}

module.exports = {
  pushDataPointToSession: pushDataPointToSession,
  getSessionRecording: getSessionRecording,
};
