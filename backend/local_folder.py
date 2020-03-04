'''
This file sets up the local folder class for getting the files stored within
the local jupyterhub folder and the size of that folder.

Author: 2019-20 CUAHSI Olin SCOPE Team
Email: vickymmcd@gmail.com
'''
#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import glob
import shutil
from pathlib import *


''' Class that defines a Local Folder so we can access attributes of it.
'''
class LocalFolder:

    def get_contents_recursive(self, folderpath, resource_data_root_dir, path_prefix):
        """Uses recursion to get & properly nest contents of folders stored locally
        """
        # get all the files in the folder
        files = glob.glob('{}/*'.format(folderpath))
        # return empty list if the folder is empty
        if len(files) == 0:
            return []

        files2 = []
        for filepath in files:
            # check contents recursively:
            folder_contents = self.get_contents_recursive(filepath, resource_data_root_dir, path_prefix)
            
            # Populate info:
            dirpath = Path(filepath)
            filename = dirpath.stem
            # Set file type
            if dirpath.is_file(): # is file
                if dirpath.suffix:
                    file_type = dirpath.suffix[1:] # without '.'
                else:
                    file_type = 'file'
            elif dirpath.is_dir(): # is folder
                file_type = "folder"
            else: # is neither
                file_type = "unknown"

            # if it was a folder, we need to populate its list of contents
            path_rel_resource_root = str(dirpath.relative_to(resource_data_root_dir))
            if path_rel_resource_root == '.':
                path_rel_resource_root = '/'
            else:
                path_rel_resource_root = '/' + path_rel_resource_root
            if file_type == "folder":
                files2.append({
                    "name": filename,
                    "path": path_prefix + path_rel_resource_root,
                    "sizeBytes": dirpath.stat().st_size,
                    "type": file_type,
                    "contents": folder_contents,
                })
            # otherwise we just get the relevant file information
            else:
                files2.append({
                    "name": filename,
                    "path": path_prefix + path_rel_resource_root,
                    "sizeBytes": dirpath.stat().st_size,
                    "type": file_type,
                })
        return files2

    def delete_file(self, filepath):
        os.remove(filepath)

    def delete_folder(self, filepath):
        if isinstance(filepath, PosixPath):
            filepath = str(filepath)
        shutil.rmtree(filepath) 

    def create_folder(self, folderpath):
        try:
            # Create target Directory
            os.makedirs(folderpath)
        except FileExistsError:
            print("Directory " , folderpath ,  " already exists")

    def upload_file_to_JH(self, file_info, file_destination):
        
        filename, content_type = file_info["filename"], file_info["content_type"]
        body = file_info["body"]
        f = open(file_destination+filename, "wb")
        f.write(body)
        f.close()

