import os
import re

def case_preserving_replace(text, search, replacement):
    # This is a bit tricky, let's just do explicit replaces
    replacements = [
        ('pledge', 'demand'),
        ('Pledge', 'Demand'),
        ('PLEDGE', 'DEMAND'),
        ('pledges', 'demands'),
        ('Pledges', 'Demands'),
        ('PLEDGES', 'DEMANDS')
    ]
    for s, r in replacements:
        text = text.replace(s, r)
    return text

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = case_preserving_replace(content, 'pledge', 'demand')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

def main():
    rootDir = '.'
    exclude_dirs = ['node_modules', '.git', '.next']
    
    # 1. Update file contents
    for dirpath, dirnames, filenames in os.walk(rootDir):
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for filename in filenames:
            if filename.endswith(('.js', '.jsx', '.json', '.prisma', '.md', '.html', '.css', '.env')):
                filepath = os.path.join(dirpath, filename)
                process_file(filepath)
                
    # 2. Rename files
    for dirpath, dirnames, filenames in os.walk(rootDir, topdown=False):
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for filename in filenames:
            if 'pledge' in filename.lower():
                old_path = os.path.join(dirpath, filename)
                new_filename = case_preserving_replace(filename, 'pledge', 'demand')
                new_path = os.path.join(dirpath, new_filename)
                os.rename(old_path, new_path)
                print(f"Renamed {old_path} to {new_path}")
                
    # 3. Rename directories
    for dirpath, dirnames, filenames in os.walk(rootDir, topdown=False):
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for dirname in dirnames:
            if 'pledge' in dirname.lower():
                old_path = os.path.join(dirpath, dirname)
                new_dirname = case_preserving_replace(dirname, 'pledge', 'demand')
                new_path = os.path.join(dirpath, new_dirname)
                os.rename(old_path, new_path)
                print(f"Renamed {old_path} to {new_path}")

if __name__ == '__main__':
    main()
