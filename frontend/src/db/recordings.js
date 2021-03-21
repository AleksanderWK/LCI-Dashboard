let { db } = require("./nedb.js");

db.recordings.persistence.setAutocompactionInterval(10000);

function pushDataPointToSession(timestamp, data, sessionId, recordingId) {
  db.recordings.update(
    { sessionId: sessionId },
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
        ["data." + recordingId + ".ipd"]: data.ipd,
        ["data." + recordingId + ".pa"]: data.pa,
        ["data." + recordingId + ".eng"]: data.eng,
        ["data." + recordingId + ".ps"]: data.ps,
        ["data." + recordingId + ".er"]: data.er,
        ["data." + recordingId + ".ms"]: data.ms,
        ["data." + recordingId + ".esf"]: data.esf,

        // ALTERNATIVE: One object per data point containing all variables and timestamp
        // ["data." + recordingId]: { ...data, timestamp: timestamp },

        // ALTERNATIVE: Timestamp stored for each variable data point
        /*
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
        */
      },
    },
    { multi: false, upsert: true },
    () => {}
  );
}

module.exports = {
  pushDataPointToSession: pushDataPointToSession,
};
