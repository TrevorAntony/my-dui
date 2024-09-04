# Ensure Conda is available in the current session
$env:CONDA_PREFIX = "$HOME\miniconda3"
$env:CONDA_ROOT = "$env:CONDA_PREFIX"
$env:PATH = "$env:CONDA_ROOT\Scripts;$env:PATH"

# Function to write colored output
function Write-Color {
  param (
    [string]$Text,
    [string]$Color
  )
  $colorMap = @{
    "Red" = "DarkRed"
    "Green" = "DarkGreen"
    "Yellow" = "DarkYellow"
    "Blue" = "DarkBlue"
    "NC" = "White"
  }
  $host.ui.RawUI.ForegroundColor = $colorMap[$Color]
  Write-Host $Text
  $host.ui.RawUI.ForegroundColor = "White"
}

# Function to download repository zip
function Download-Repo-Zip {
  param (
    [string]$RepoName,
    [string]$GithubOrg,
    [string]$GithubRepo,
    [string]$Branch,
    [string]$GithubToken
  )

  Write-Color "Downloading $RepoName from $GithubOrg/$GithubRepo..." Blue
  $Url = "https://github.com/$GithubOrg/$GithubRepo/archive/refs/heads/$Branch.zip"
  $Zip = "$ZIP_DIR\$GithubRepo-$Branch.zip"
  try {
    $headers = @{
      "Authorization" = "token $GithubToken"
      "User-Agent" = "PowerShell"
    }
    Invoke-WebRequest -Uri $Url -Headers $headers -OutFile $Zip -ErrorAction Stop
    Write-Color "$GithubRepo-$Branch.zip downloaded successfully." Green
  } catch {
    Write-Color "Failed to download the $GithubRepo-$Branch.zip. Error: $_" Red
    exit 1
  }
}

# Function to extract zip files
function Extract-Zip-Files {
  param (
    [string]$Zip,
    [string]$DestDir
  )

  Write-Color "Extracting $Zip..." Blue
  Expand-Archive -Path $Zip -DestinationPath $ZIP_DIR -Force

  if ($?) {
    Write-Color "$Zip extraction completed." Green

    # Extracted folder name is derived from the zip file name
    $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($Zip)
    $ExtractedDir = Join-Path $ZIP_DIR "$BaseName"

    if (Test-Path $ExtractedDir) {
      Move-Item -Path "$ExtractedDir\*" -Destination $DestDir -Force
      Remove-Item $ExtractedDir -Recurse -Force
    } else {
      Write-Color "Failed to locate the extracted directory." Red
      exit 1
    }
    Remove-Item $Zip
  } else {
    Write-Color "Failed to extract $Zip." Red
    exit 1
  }
}

# Function to extract workspace zip files
function Extract-Workspace-Zip-For-Data-And-Env-File {
  param (
    [string]$Zip,
    [string]$DataDir
  )

  Write-Color "Extracting $Zip..." Blue
  Expand-Archive -Path $Zip -DestinationPath $ZIP_DIR -Force

  if ($?) {
    Write-Color "$Zip extraction completed." Green

    # Extracted folder name is derived from the zip file name
    $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($Zip)
    $ExtractedDir = Join-Path $ZIP_DIR "$BaseName"

    if (Test-Path $ExtractedDir) {
      Move-Item "$ExtractedDir\$DataDir" $ZIP_DIR
      Move-Item "$ExtractedDir\.env" $ZIP_DIR
      Remove-Item $ExtractedDir -Recurse -Force
    }
    Remove-Item $Zip
  } else {
    Write-Color "Failed to extract $Zip." Red
    exit 1
  }
}

# Function to create and activate a Conda environment
function Create-And-Install-Conda-Env {
  param (
    [string]$ServerDir,
    [string]$ConfigDir,
    [string]$EnvName,
    [string]$PythonVersion
  )

  Write-Color "Creating Conda environment '$EnvName' with Python $PythonVersion in $Dir..." Blue

  # Create Conda environment
  conda create --name "$EnvName" python=$PythonVersion -y


  if ($?) {
    Write-Color "Conda environment created successfully in $Dir." Green
  } else {
    Write-Color "Failed to create Conda environment in $Dir." Red
    exit 1
  }

  # Activate the Conda environment
  & conda activate "$EnvName"

  # Install dependencies from requirements.txt
  $RequirementsFile = "$ServerDir\requirements.txt"
  if (Test-Path $RequirementsFile) {
    Write-Color "Installing dependencies from requirements.txt..." Blue
    conda run -n "$EnvName" pip install -r $RequirementsFile

    if ($?) {
      Write-Color "Dependencies installed successfully." Green
    } else {
      Write-Color "Failed to install dependencies." Red
      exit 1
    }
  } else {
    Write-Color "No requirements.txt found in $ServerDir." Yellow
  }

  # Install additional dependencies from requirements.txt
  $RequirementsFile = "$ConfigDir\requirements.txt"
  if (Test-Path $RequirementsFile) {
    Write-Color "Installing additional dependencies from requirements.txt..." Blue
    conda run -n "$EnvName" pip install -r $RequirementsFile

    if ($?) {
      Write-Color "Additional Dependencies installed successfully." Green
    } else {
      Write-Color "Failed to install additional dependencies." Red
      exit 1
    }
  } else {
    Write-Color "No requirements.txt found in $ConfigDir." Yellow
  }

  # Deactivate the Conda environment
  conda deactivate
}

# Function to pack the Conda environment
function Pack-Conda-Env {
  param (
    [string]$Dir,
    [string]$EnvName
  )


  # Check if conda-pack is installed, and install it if necessary
  Write-Host "Checking if conda-pack is installed..."
  $condaPackInstalled = conda list | Select-String -Pattern "conda-pack"

  if (-not $condaPackInstalled) {
    Write-Host "Installing conda-pack..."
    conda install -c conda-forge conda-pack -y
    if ($?) {
      Write-Host "conda-pack successfully installed."
    } else {
      Write-Host "Failed to install conda-pack." -ForegroundColor Red
      exit 1
    }
  } else {
    Write-Host "conda-pack is already installed."
  }

  # Packing Conda environment 'portable-venv' into portable-venv.tar.gz
  Write-Color "Packing Conda environment '$EnvName' into portable-venv.tar.gz..." Blue
  conda-pack -n "$EnvName" -o "$Dir\portable-venv.tar.gz"

  if ($?) {
    Write-Color "Conda environment packed successfully." Green
  } else {
    Write-Color "Failed to pack Conda environment." Red
    exit 1
  }
}

# Script execution

# Constants
$ZIP_DIR = "duft_resources"
$ZIP_FILE = "duft_resources.zip"
$ENV_NAME = "portable-venv"
$PYTHON_VERSION = "3.11"

# Create necessary directories
if (-Not (Test-Path $ZIP_DIR)) {
  New-Item -Path $ZIP_DIR -ItemType Directory
}

# Read GitHub organization and token
$GITHUB_ORG = $env:GITHUB_ORG
$GITHUB_TOKEN = $env:GITHUB_TOKEN

# Repo details
$REPO1_REPO = "duft-server"
$REPO1_BRANCH = "main"
$REPO2_REPO_DEFAULT = "duft-config"
$REPO2_BRANCH_DEFAULT = "namibia-3dl"
$REPO3_REPO_DEFAULT = "duft-workspace-django"
$REPO3_BRANCH_DEFAULT = "main"

# Read duft-config's repository
$REPO2_REPO = $env:REPO2_REPO
if (-not $REPO2_REPO) {
  $REPO2_REPO = $REPO2_REPO_DEFAULT
}

# Read duft-config's branch
$REPO2_BRANCH = $env:REPO2_BRANCH
if (-not $REPO2_BRANCH) {
  $REPO2_BRANCH = $REPO2_BRANCH_DEFAULT
}

# Read duft-workspace-django's repository
$REPO3_REPO = $env:REPO3_REPO
if (-not $REPO3_REPO) {
  $REPO3_REPO = $REPO3_REPO_DEFAULT
}

# Read duft-workspace-django's branch
$REPO3_BRANCH = $env:REPO3_BRANCH
if (-not $REPO3_BRANCH) {
  $REPO3_BRANCH = $REPO3_BRANCH_DEFAULT
}

# Create server package directories
$DUFT_SERVER_DIR = "$ZIP_DIR\duft-server"
$DUFT_CONFIG_DIR = "$ZIP_DIR\duft-config"
New-Item -Path $DUFT_SERVER_DIR -ItemType Directory -Force
New-Item -Path $DUFT_CONFIG_DIR -ItemType Directory -Force

# Download repositories .zips
Download-Repo-Zip -RepoName $REPO1_REPO -GithubOrg $GITHUB_ORG -GithubRepo $REPO1_REPO -Branch $REPO1_BRANCH -GithubToken $GITHUB_TOKEN
Download-Repo-Zip -RepoName $REPO2_REPO -GithubOrg $GITHUB_ORG -GithubRepo $REPO2_REPO -Branch $REPO2_BRANCH -GithubToken $GITHUB_TOKEN
Download-Repo-Zip -RepoName $REPO3_REPO -GithubOrg $GITHUB_ORG -GithubRepo $REPO3_REPO -Branch $REPO3_BRANCH -GithubToken $GITHUB_TOKEN

# Extract downloaded repositories
Extract-Zip-Files -Zip "$ZIP_DIR\$REPO1_REPO-$REPO1_BRANCH.zip" -DestDir $DUFT_SERVER_DIR
Extract-Zip-Files -Zip "$ZIP_DIR\$REPO2_REPO-$REPO2_BRANCH.zip" -DestDir $DUFT_CONFIG_DIR
Extract-Workspace-Zip-For-Data-And-Env-File -Zip "$ZIP_DIR\$REPO3_REPO-$REPO3_BRANCH.zip" -DataDir "data"

# Create Conda environment and install packages
Create-And-Install-Conda-Env -ServerDir $DUFT_SERVER_DIR -ConfigDir $DUFT_CONFIG_DIR -EnvName $ENV_NAME -PythonVersion $PYTHON_VERSION

# Pack Conda environment
Pack-Conda-Env -Dir $DUFT_SERVER_DIR -EnvName $ENV_NAME

# Zip the duft_resources directory
Compress-Archive -Path $ZIP_DIR -DestinationPath $ZIP_FILE -Force
if ($?) {
  Write-Color "duft_resources directory zipped successfully." Green
} else {
  Write-Color "Failed to zip the duft_resources directory." Red
  exit 1
}
