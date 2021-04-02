from subprocess import Popen


class OpenFaceInstance:

    process = None
    out_filename = "data"
    device_id = 0

    def __init__(self, out_dir, out_filename, device_id):
        self.out_filename = out_filename
        self.device_id = device_id

    def __init__(self):
        pass

    def start(self):
        self.process = Popen("\".\openface2\FeatureExtraction.exe\"" +
                             " -device " + str(self.device_id) +
                             " -of " + "\"" + self.out_filename + "\"")

    def terminate(self):
        self.process.terminate()
