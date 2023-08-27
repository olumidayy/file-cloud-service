import FileRepository from '../../../src/modules/files/files.repository';
import FlagRepository from '../../../src/modules/flags/flags.repository';
import FileService from '../../../src/modules/files/files.service';
import { FileHistoriesMock, FileHistoryMock, FileMock, FilesMock, FlagMock } from '../../mocks';
import { FileAction } from '@prisma/client';

jest.mock('../../../src/modules/files/files.repository', () => ({
  default: {
    create: jest.fn((data) => FileMock),
    update: jest.fn(() => FileMock),
    getMany: jest.fn(() => FilesMock),
    getOne: jest.fn((data) => data?.name ? FileMock : null),
    getById: jest.fn((id) => id ? FileMock : null),
    delete: jest.fn(),
    addFileHistory: jest.fn(() => FileHistoryMock),
    getFileHistory: jest.fn(() => FileHistoriesMock),
  }
}));

jest.mock('../../../src/modules/flags/flags.repository', () => ({
  default: {
    getOne: jest.fn((data) => data.flaggerId ? FlagMock: null),
    create: jest.fn(() => FlagMock),
    delete: jest.fn(),
  }
}));


describe('FileService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  
  describe('FileService.create', () => {
    it('should call FileRepository.create', async () => {
      const data = {
        name: '',
        key: 'key',
        userId: 'userId'
      };
      const files = await FileService.createFile(data);
      expect(FileRepository.create).toBeCalledWith(data);
      expect(files).toEqual(FileMock);
    });
  });

  describe('FileService.getAllFiles', () => {
    it('should call FileRepository.getMany', async () => {
      const files = await FileService.getAllFiles();
      expect(FileRepository.getMany).toBeCalled();
      expect(files).toEqual(FilesMock);
    });
  });

  describe('FileService.getFileById', () => {
    it('should call FileRepository.getById', async () => {
      const id = 'ID';
      const file = await FileService.getFileById(id);
      expect(FileRepository.getById).toBeCalledWith(id);
      expect(file).toEqual(FileMock);
    });
  });

  describe('FileService.getFileById with invalid id', () => {
    it('should throw an error', async () => {
      await expect(FileService.getFileById('')).rejects.toThrow('File not found.');
    });
  });

  describe('FileService.getFilesByUserId', () => {
    it('should call FileRepository.getMany', async () => {
      const id = 'ID';
      const files = await FileService.getFilesByUserId(id);
      expect(FileRepository.getMany).toBeCalledWith({ userId: id });
      expect(files).toEqual(FilesMock);
    });
  });

  describe('FileService.updateFile', () => {
    it('should call FileRepository.update', async () => {
      const id = 'ID';
      const file = await FileService.updateFile(id, {});
      expect(FileRepository.getById).toBeCalledWith(id);
      expect(FileRepository.update).toBeCalledWith(id, {});
      expect(file).toEqual(FileMock);
    });
  });

  describe('FileService.flagFile.', () => {
    it('should call FileRepository.update and FlagRepository.create', async () => {
      const fileId = 'ID';
      const flaggerId = '';
      const file = await FileService.flagFile(fileId, flaggerId);
      expect(FlagRepository.getOne).toBeCalledWith({ fileId, flaggerId });
      expect(FlagRepository.create).toBeCalledWith({ fileId, flaggerId });
      expect(FileRepository.update).toBeCalled();
      expect(FileRepository.delete).toBeCalledWith(fileId);
      expect(file).toEqual(FlagMock);
    });
  });

  describe('FileService.unflagFile.', () => {
    it('should call FileRepository.update and FlagRepository.delete', async () => {
      const fileId = 'ID';
      const flaggerId = 'UID';
      const file = await FileService.unflagFile(fileId, flaggerId);
      expect(FlagRepository.getOne).toBeCalledWith({ fileId, flaggerId });
      expect(FileRepository.update).toBeCalled();
      expect(FlagRepository.delete).toBeCalled();
      expect(file).toBe(undefined);
    });
  });

  describe('FileService.addFileHistory.', () => {
    it('should call FileRepository.addFileHistory.', async () => {
      const fileId = 'ID';
      const action = FileAction.UPLOAD;
      const fileHistory = await FileService.addFileHistory(fileId, action);
      expect(FileRepository.addFileHistory).toBeCalledWith(fileId, action);
      expect(fileHistory).toBe(FileHistoryMock);
    });
  });

  describe('FileService.getFileHistory.', () => {
    it('should call FileRepository.getFileHistory.', async () => {
      const fileId = 'ID';
      const action = FileAction.UPLOAD;
      const fileHistory = await FileService.getFileHistory(fileId);
      expect(FileRepository.getFileHistory).toBeCalledWith(fileId);
      expect(fileHistory).toBe(FileHistoriesMock);
    });
  });

  describe('FileService.deleteFile', () => {
    it('should call FileRepository.delete', async () => {
      const id = 'ID';
      await FileService.deleteFile(id);
      expect(FileRepository.getById).toBeCalledWith(id);
      expect(FileRepository.delete).toBeCalledWith(id);
    });
  });

  describe('FileService.deleteFile when File does not exist.', () => {
    it('should throw an Error', async () => {
      const id = 'ID';
      await expect(FileService.deleteFile('')).rejects.toThrow('File not found.');
    });
  });
});
