import FolderRepository from '../../../src/modules/folders/folders.repository';
import FolderService from '../../../src/modules/folders/folders.service';
import { FolderMock, FoldersMock } from '../../mocks';

jest.mock('../../../src/modules/folders/folders.repository', () => ({
  default: {
    create: jest.fn((data) => FolderMock),
    update: jest.fn(() => FolderMock),
    getMany: jest.fn(() => FoldersMock),
    getOne: jest.fn((data) => FolderMock),
    getById: jest.fn((id) => id ? FolderMock : null),
    delete: jest.fn(),
  }
}));


describe('FolderService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  
  describe('FolderService.create', () => {
    it('should call FolderRepository.create', async () => {
      const folder = await FolderService.createFolder(FolderMock);
      expect(FolderRepository.create).toBeCalledWith(FolderMock);
      expect(folder).toEqual(FolderMock);
    });
  });

  describe('FolderService.getAllFolders', () => {
    it('should call FolderRepository.getMany', async () => {
      const Folders = await FolderService.getAllFolders();
      expect(FolderRepository.getMany).toBeCalled();
      expect(Folders).toEqual(FoldersMock);
    });
  });

  describe('FolderService.getFolderById', () => {
    it('should call FolderRepository.getById', async () => {
      const id = 'ID';
      const Folder = await FolderService.getFolderById(id);
      expect(FolderRepository.getById).toBeCalledWith(id);
      expect(Folder).toEqual(FolderMock);
    });
  });

  describe('FolderService.getFolderById with invalid id', () => {
    it('should throw an error', async () => {
      await expect(FolderService.getFolderById('')).rejects.toThrow('Folder not found.');
    });
  });

  describe('FolderService.getFoldersByUserId', () => {
    it('should call FolderRepository.getMany', async () => {
      const id = 'ID';
      const Folders = await FolderService.getFoldersByUserId(id);
      expect(FolderRepository.getMany).toBeCalledWith({ userId: id });
      expect(Folders).toEqual(FoldersMock);
    });
  });

  describe('FolderService.updateFolder', () => {
    it('should call FolderRepository.update', async () => {
      const id = 'ID';
      const Folder = await FolderService.updateFolder(id, {});
      expect(FolderRepository.getById).toBeCalledWith(id);
      expect(FolderRepository.update).toBeCalledWith(id, {});
      expect(Folder).toEqual(FolderMock);
    });
  });

  describe('FolderService.deleteFolder', () => {
    it('should call FolderRepository.delete', async () => {
      const id = 'ID';
      await FolderService.deleteFolder(id);
      expect(FolderRepository.getById).toBeCalledWith(id);
      expect(FolderRepository.delete).toBeCalledWith(id);
    });
  });

  describe('FolderService.deleteFolder when Folder does not exist.', () => {
    it('should throw an Error', async () => {
      const id = 'ID';
      await expect(FolderService.deleteFolder('')).rejects.toThrow('Folder not found.');
    });
  });
});
