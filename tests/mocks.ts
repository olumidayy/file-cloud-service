import { FileAction, UserRole } from '@prisma/client';

const UserMock = {
  id: 'ID',
  firstname: 'Olumide',
  lastname: 'Nwosu',
  email: 'olumidenwosu@gmail.com',
  password: 'password',
  role: UserRole.ADMIN,
};

const UsersMock = [
  {
    firstname: 'Olumide',
    lastname: 'Nwosu',
    email: 'olumidenwosu0@gmail.com',
    password: 'password',
  },
  {
    firstname: 'Olumide',
    lastname: 'Nwosu',
    email: 'olumidenwosu1@gmail.com',
    password: 'password',
  },
  {
    firstname: 'Olumide',
    lastname: 'Nwosu',
    email: 'olumidenwosu2@gmail.com',
    password: 'password',
  },
];

const FileMock = {
  id: 'ID',
  name: 'file',
  folderId: 'folderId',
  userId: 'userId',
  key: 'key.png',
  flagCount: 5,
};

const FilesMock = [
  {
    name: 'file0',
    folderId: 'folderId',
    userId: 'userId',
    key: 'key',
  },
  {
    name: 'file1',
    folderId: 'folderId',
    userId: 'userId',
    key: 'key',
  },
  {
    name: 'file2',
    folderId: 'folderId',
    userId: 'userId',
    key: 'key',
  },
];

const FlagMock = {
  flaggerId: 'flaggerId',
  fileId: 'fileId',
};

const FileHistoryMock = {
  action: FileAction.UPLOAD,
  fileId: 'fileId',
};
const FileHistoriesMock = [
  {
    action: FileAction.UPLOAD,
    fileId: 'fileId',
  },
  {
    action: FileAction.UPLOAD,
    fileId: 'fileId',
  },
  {
    action: FileAction.UPLOAD,
    fileId: 'fileId',
  },
];

const FolderMock = {
  name: 'name',
  userId: 'userId',
};

const FoldersMock = [
  {
    name: 'name',
    userId: 'userId',
  },
  {
    name: 'name',
    userId: 'userId',
  },
  {
    name: 'name',
    userId: 'userId',
  },
];

export {
  UserMock,
  UsersMock,
  FileMock,
  FilesMock,
  FlagMock,
  FileHistoryMock,
  FileHistoriesMock,
  FolderMock,
  FoldersMock,
};
