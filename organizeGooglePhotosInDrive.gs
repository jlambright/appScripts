var s_props = PropertiesService.getScriptProperties();
var photos_folder_id = s_props.getProperty('photos_folder_id') // You can do this other ways, but I prefer this.

function manageRootFiles() {
  var root_files = DriveApp.getFolderById(photos_folder_id).getFiles();
  
  while (root_files.hasNext()) {
    var file = root_files.next();
    var created_on_data = getCreatedOnData(file.getId());
    var dest_folder_id = createFolderStructureByDate(created_on_data);
    moveFileToAnotherFolder(file.getId(),dest_folder_id);
  }
}

function getCreatedOnData(fileId) {
 var created_on_timestamp = DriveApp.getFileById(fileId).getDateCreated();
 var date = new Date(created_on_timestamp);
 var months_enum = {
   0: 'JAN',
   1: 'FEB',
   2: 'MAR',
   3: 'APR',
   4: 'MAY',
   5: 'JUN',
   6: 'JUL',
   7: 'AUG',
   8: 'SEP',
   9: 'OCT',
   10: 'NOV',
   11: 'DEC',
 };
  
  var date_data = {
    'year': date.getYear(),
    'month': months_enum[date.getMonth()],
    'date': date.getDate()
  }  

 return date_data;
}

function createFolderStructureByDate(date_data) {

  var date = date_data.date;
  var month = date_data.month;
  var year = date_data.year;
  var temp_folder_id = photos_folder_id;
  
  for (key in date_data) {
    temp_folder_id = ensureFolderExists(date_data[key],temp_folder_id);
  }
  
  return temp_folder_id;
}

// Move file to another Google Drive Folder

function moveFileToAnotherFolder(fileId, targetFolderId) {
  var photos_folder = DriveApp.getFolderById(photos_folder_id);
  var dest_folder = DriveApp.getFolderById(targetFolderId);
  var file = DriveApp.getFileById(fileId);
  
  dest_folder.addFile(file);
  photos_folder.removeFile(file)
  
}

function ensureFolderExists(sub_folder_name, parent_folder_id) {
  var matchingChildren = DriveApp.getFolderById(parent_folder_id).getFoldersByName(sub_folder_name);
  
  if (matchingChildren.hasNext()) {
    return matchingChildren.next().getId();
  } else {return DriveApp.getFolderById(parent_folder_id).createFolder(sub_folder_name).getId()};
}
