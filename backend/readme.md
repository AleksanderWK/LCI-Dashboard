# Backend

# How to install and run

### 1. Install pipenv

`pip install pipenv`

### 2. Enter pipenv shell

`pipenv shell`

### 3. Install dependencies

`pipenv install`

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

Run the following command while being in /openface2:
`powershell -noexit -executionpolicy bypass -File download_models.ps1`
