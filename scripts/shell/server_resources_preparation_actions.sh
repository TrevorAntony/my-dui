#!/bin/bash

# Ensure Conda is available in the current session
case "$CI_OS" in
  Linux)
    export CONDA_PREFIX="/usr/share/miniconda3"
    ;;
  macOS)
    export CONDA_PREFIX="/Users/runner/miniconda3"
    ;;
  *)
    echo "Unsupported OS: $CI_OS"
    exit 1
    ;;
esac

export CONDA_ROOT="$CONDA_PREFIX"
export PATH="$CONDA_ROOT/bin:$PATH"

# Function to write colored output
write_color() {
  local text=$1
  local color=$2
  case $color in
    "Red") echo -e "\e[31m$text\e[0m" ;;
    "Green") echo -e "\e[32m$text\e[0m" ;;
    "Yellow") echo -e "\e[33m$text\e[0m" ;;
    "Blue") echo -e "\e[34m$text\e[0m" ;;
    "NC") echo -e "\e[39m$text\e[0m" ;;
  esac
}

# Function to download repository zip
download_repo_zip() {
  local repo_name=$1
  local github_org=$2
  local github_repo=$3
  local branch=$4
  local github_token=$5

  write_color "Downloading $repo_name from $github_org/$github_repo..." Blue
  local url="https://github.com/$github_org/$github_repo/archive/refs/heads/$branch.zip"
  local zip="$ZIP_DIR/$github_repo-$branch.zip"
  if curl -L -H "Authorization: token $github_token" -H "User-Agent: Bash" -o "$zip" "$url"; then
    write_color "$github_repo-$branch.zip downloaded successfully." Green
  else
    write_color "Failed to download the $github_repo-$branch.zip." Red
    exit 1
  fi
}

# Function to extract zip files
extract_zip_files() {
  local zip=$1
  local dest_dir=$2

  write_color "Extracting $zip..." Blue
  unzip -q "$zip" -d "$ZIP_DIR"

  if [ $? -eq 0 ]; then
    write_color "$zip extraction completed." Green
    local base_name=$(basename "$zip" .zip)
    local extracted_dir="$ZIP_DIR/$base_name"

    if [ -d "$extracted_dir" ]; then
      mv "$extracted_dir"/* "$dest_dir"
      rm -rf "$extracted_dir"
    else
      write_color "Failed to locate the extracted directory." Red
      exit 1
    fi
    rm -f "$zip"
  else
    write_color "Failed to extract $zip." Red
    exit 1
  fi
}

# Function to extract workspace zip files
extract_workspace_zip_for_data_and_env_file() {
  local zip=$1
  local data_dir=$2

  write_color "Extracting $zip..." Blue
  unzip -q "$zip" -d "$ZIP_DIR"

  if [ $? -eq 0 ]; then
    write_color "$zip extraction completed." Green
    local base_name=$(basename "$zip" .zip)
    local extracted_dir="$ZIP_DIR/$base_name"

    if [ -d "$extracted_dir" ]; then
      mv "$extracted_dir/$data_dir" "$ZIP_DIR"
      mv "$extracted_dir/.env" "$ZIP_DIR"
      rm -rf "$extracted_dir"
    fi
    rm -f "$zip"
  else
    write_color "Failed to extract $zip." Red
    exit 1
  fi
}

# Function to create and activate a Conda environment
create_and_install_conda_env() {
  local dir=$1
  local config_dir=$2
  local env_name=$3
  local python_version=$4

  write_color "Creating Conda environment '$env_name' with Python $python_version in $dir..." Blue

  # Create Conda environment
  conda create --name "$env_name" python="$python_version" -y

  if [ $? -eq 0 ]; then
    write_color "Conda environment created successfully in $dir." Green
  else
    write_color "Failed to create Conda environment in $dir." Red
    exit 1
  fi

  # Activate the Conda environment
  source activate "$env_name"

  # Install dependencies from requirements.txt
  local requirements_file="$dir/requirements.txt"
  if [ -f "$requirements_file" ]; then
    write_color "Installing dependencies from requirements.txt..." Blue
    conda run -n "$env_name" pip install -r "$requirements_file"

    if [ $? -eq 0 ]; then
      write_color "Dependencies installed successfully." Green
    else
      write_color "Failed to install dependencies." Red
      exit 1
    fi
  else
    write_color "No requirements.txt found in $dir." Yellow
  fi

  # Install additional dependencies from requirements.txt
  local requirements_file="$config_dir/requirements.txt"
  if [ -f "$requirements_file" ]; then
    write_color "Installing additional dependencies from requirements.txt..." Blue
    conda run -n "$env_name" pip install -r "$requirements_file"

    if [ $? -eq 0 ]; then
      write_color "Additional Dependencies installed successfully." Green
    else
      write_color "Failed to install additional dependencies." Red
      exit 1
    fi
  else
    write_color "No requirements.txt found in $config_dir." Yellow
  fi

  # Deactivate the Conda environment
  conda deactivate
}

# Function to pack the Conda environment
pack_conda_env() {
  local dir=$1
  local env_name=$2

  # Check if conda-pack is installed, and install it if necessary
  write_color "Checking if conda-pack is installed..." Blue
  if ! conda list | grep -q "conda-pack"; then
    write_color "Installing conda-pack..." Blue
    conda install -c conda-forge conda-pack -y
    if [ $? -eq 0 ]; then
      write_color "conda-pack successfully installed." Green
    else
      write_color "Failed to install conda-pack." Red
      exit 1
    fi
  else
    write_color "conda-pack is already installed." Green
  fi

  # Packing Conda environment 'portable-venv' into portable-venv.tar.gz
  write_color "Packing Conda environment '$env_name' into portable-venv.tar.gz..." Blue
  conda-pack -n "$env_name" -o "$dir/portable-venv.tar.gz"

  if [ $? -eq 0 ]; then
    write_color "Conda environment packed successfully." Green
  else
    write_color "Failed to pack Conda environment." Red
    exit 1
  fi
}

# Script execution

# Constants
ZIP_DIR="duft_resources"
ZIP_FILE="duft_resources.zip"
ENV_NAME="portable-venv"
PYTHON_VERSION="3.11"

# Create necessary directories
mkdir -p "$ZIP_DIR"

# Read GitHub organization and token
GITHUB_ORG=$GITHUB_ORG
GITHUB_TOKEN=$GITHUB_TOKEN

# Repo details
REPO1_REPO="duft-server"
REPO1_BRANCH="main"
REPO2_REPO_DEFAULT="duft-config"
REPO2_BRANCH_DEFAULT="namibia-3dl"
REPO3_REPO_DEFAULT="duft-workspace-django"
REPO3_BRANCH_DEFAULT="main"

# Read duft-config's repository
REPO2_REPO=${REPO2_REPO:-$REPO2_REPO_DEFAULT}

# Read duft-config's branch
REPO2_BRANCH=${REPO2_BRANCH:-$REPO2_BRANCH_DEFAULT}

# Read duft-workspace-django's repository
REPO3_REPO=${REPO3_REPO:-$REPO3_REPO_DEFAULT}

# Read duft-workspace-django's branch
REPO3_BRANCH=${REPO3_BRANCH:-$REPO3_BRANCH_DEFAULT}

# Create server package directories
DUFT_SERVER_DIR="$ZIP_DIR/duft-server"
DUFT_CONFIG_DIR="$ZIP_DIR/duft-config"
mkdir -p "$DUFT_SERVER_DIR"
mkdir -p "$DUFT_CONFIG_DIR"

# Download repositories .zips
download_repo_zip "$REPO1_REPO" "$GITHUB_ORG" "$REPO1_REPO" "$REPO1_BRANCH" "$GITHUB_TOKEN"
download_repo_zip "$REPO2_REPO" "$GITHUB_ORG" "$REPO2_REPO" "$REPO2_BRANCH" "$GITHUB_TOKEN"
download_repo_zip "$REPO3_REPO" "$GITHUB_ORG" "$REPO3_REPO" "$REPO3_BRANCH" "$GITHUB_TOKEN"

# Extract downloaded repositories
extract_zip_files "$ZIP_DIR/$REPO1_REPO-$REPO1_BRANCH.zip" "$DUFT_SERVER_DIR"
extract_zip_files "$ZIP_DIR/$REPO2_REPO-$REPO2_BRANCH.zip" "$DUFT_CONFIG_DIR"
extract_workspace_zip_for_data_and_env_file "$ZIP_DIR/$REPO3_REPO-$REPO3_BRANCH.zip" "data"

# Create Conda environment and install packages
create_and_install_conda_env "$DUFT_SERVER_DIR" "$DUFT_CONFIG_DIR" "$ENV_NAME" "$PYTHON_VERSION"

# Pack Conda environment
pack_conda_env "$DUFT_SERVER_DIR" "$ENV_NAME"

# Zip the duft_resources directory
zip -rq "$ZIP_FILE" "$ZIP_DIR"
if [ $? -eq 0 ]; then
  write_color "duft_resources directory zipped successfully." Green
else
  write_color "Failed to zip the duft_resources directory." Red
  exit 1
fi
