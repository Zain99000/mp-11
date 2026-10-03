import os
import zipfile

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
ZIP_OUTPUTS = [
    os.path.join(PROJECT_ROOT, "campusflow_code.zip"),
    os.path.join(PROJECT_ROOT, "public", "campusflow_code.zip"),
    os.path.join(PROJECT_ROOT, "dist", "campusflow_code.zip")
]

# Ensure public and dist exist
os.makedirs(os.path.join(PROJECT_ROOT, "public"), exist_ok=True)
os.makedirs(os.path.join(PROJECT_ROOT, "dist"), exist_ok=True)

IGNORED_DIRS = {
    'node_modules',
    '.git',
    'dist',
    'build',
    '.cache',
    '__pycache__'
}

IGNORED_FILES = {
    'campusflow_code.zip',
    'package-lock.json',
    '.DS_Store'
}

def create_archive(dest_path):
    print(f"Creating archive: {dest_path}")
    with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            # filter out ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith('.')]
            for file in files:
                if file in IGNORED_FILES or file.endswith('.zip') or file.endswith('.pyc'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PROJECT_ROOT)
                # don't zip output zip files
                if "campusflow_code.zip" in rel_path:
                    continue
                zipf.write(full_path, rel_path)

# First create root zip
primary_zip = ZIP_OUTPUTS[0]
create_archive(primary_zip)

# Copy to other destinations
import shutil
for target in ZIP_OUTPUTS[1:]:
    shutil.copy2(primary_zip, target)
    print(f"Copied to: {target}")

size_kb = os.path.getsize(primary_zip) / 1024
print(f"Archive successfully created! Size: {size_kb:.2f} KB")
