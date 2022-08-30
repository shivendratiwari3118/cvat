import os
import time
import json
username = input("Enter Username: ")
password = input("Enter Password: ")
project_id = input("Enter project id: ")
h5_file_dir = input("Enter path to h5 files: ")
segment_size = int(input("Enter segment size: ") or "0")


overlap  = 0
path=h5_file_dir
project_id=project_id
h5_files_list = os.listdir(path)
h5_files_list=[os.path.join(path,item) for item in h5_files_list]

for h5_file in h5_files_list:
    task_name=h5_file.split("\\")[-1]
    task_name=task_name.rsplit('.', 1)[0]
    if segment_size:
        cmd = f'python3 cli.py --auth {username}:{password} --server-host 10.40.41.58 --server-port 8080  create {task_name} --project_id {project_id} --segment_size {segment_size} local {h5_file}'
    else:
        cmd = f'python3 cli.py --auth {username}:{password} --server-host 10.40.41.58 --server-port 8080  create {task_name} --project_id {project_id} local {h5_file}'
    print(cmd)
    # os.system(cmd)    

print("create task finished please wait some time to reflect the task")