# Backend

# How to install and run

### 1. Install pipenv

This is the backend part of the application, containing a program to connect to a dashboard with a session token, retrieve data from either devices or a dataset, compute different multimodal data variables and send the results to the connected dashboard in real-time.

## Prerequisites

### 2. Enter pipenv shell

To run the program, the following is required:

- [Python 3.6](https://www.python.org/downloads/)
- [Pipenv](https://github.com/pypa/pipenv)

### 3. Install dependencies

## Installation and Setup

Install all dependencies needed:

### 4. Run main

`python main.py`

# Install Openface

The installation guide is taken from the OpenFace github: https://github.com/TadasBaltrusaitis/OpenFace/wiki/Windows-Installation:

### Requirement

1. Windows 64-bit operating systetm
2. 64-bit Visual C++ redistributable package, that can be found here: https://aka.ms/vs/16/release/vc_redist.x64.exe

### 1. Install OpenFace Binaries

Install binaries from the following link: https://github.com/TadasBaltrusaitis/OpenFace/releases/download/OpenFace_2.2.0/OpenFace_2.2.0_win_x64.zip

Move the contents of the unzipped file (not including the folder the files are in) to a new folder called `bin` under backend/datastreams/openface/.

### 2. Download all the models

Run the following command while being in backend/datastreams/openface/bin/:
`powershell -noexit -executionpolicy bypass -File download_models.ps1`

```bash
pipenv install
```

### Devices Setup

If you want to run the program using a dataset, you can ignore this subsection. If you want to run the program with actual devices, these must be set up and configured correctly to be able to communicate with the program.

Devices needed:

- Tobii Pro X3-120 (stationary eye tracker) or ??? (mobile eye tracker)
- Empatica E4 (wristband)
- HD camera

The following sections will cover how to set these up correctly to be used with the program.

#### Tobii Pro X3-120 (Stationary Eye Tracker)

1. Install the official [Eye Tracker Manager](https://www.tobiipro.com/product-listing/eye-tracker-manager/) from Tobii Pro.
2. Run the installed program and follow the instructions on the screen. When asked, install the drivers for the correct eye tracker (Tobii Pro X3-120).
3. When the eye tracker is up and running, make sure to calibrate it by pressing the "Calibrate" button and follow the instructions.

#### ??? (Mobile Eye Tracker)

...

#### Empatica E4 (wristband)

...

#### HD Camera

##### OpenFace (if stationary eye tracker)

...

##### OpenPose (if mobile eye tracker)

...

## Run the program

Start the virtual environment:

```bash
pipenv shell
```

Run the program:

```bash
python main.py SESSION_CODE [OPTIONS]
```

Options:

- --devices
  - Retrieve data from devices.
- --dataset=[id]
  - Retrieve data from a dataset (1-15).

If no options are specified, dataset 1 will be used.

### Example: Run with Dataset 12

```bash
python main.py SESSION_CODE --dataset=12
```

### Example: Run with Devices

Before launching, make sure all devices are connected and up and running.

```bash
python main.py SESSION_CODE --devices
```
