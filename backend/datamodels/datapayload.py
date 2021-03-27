import json
from datetime import datetime


class DataPayload:

    """
        This is the class that represents the data that is being sent to the dashboard. It currently consists of the MMD Variable Collection, the timestamp and the sessionCode 
    """

    timestamp = None
    dataPoints = None
    sessionCode = None

    def __init__(self, mmdv_collection, session_code):
        # timestamp() returns time since epoch in seconds, but frontend wants miliseconds
        self.timestamp = datetime.now().timestamp() * 1000

        self.dataPoints = mmdv_collection
        self.sessionCode = session_code

    def get_json(self):
        dict_value = self.__dict__
        dict_value["dataPoints"] = self.dataPoints.__dict__
        return json.dumps(dict_value)
