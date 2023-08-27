import { FileAction } from '@prisma/client';
import CacheService from '../../services/cache.service';
import prisma from '../../../prisma/client';

export default class FileRepository {
  static async create(data: any): Promise<any> {
    const newFile = await prisma.file.create({
      data,
    });
    CacheService.SetItem(newFile.id, newFile);
    return newFile;
  }

  /**
   * Fetches many files based on given data.
   * @param
   * @returns list of files
  */
  static async getMany(data?: any): Promise<any[]> {
    let files;
    if (data) {
      files = await prisma.file.findMany({ where: { ...data, deleted: false } });
      return files;
    }
    files = await prisma.file.findMany({ where: { deleted: false } });
    return files;
  }

  /**
   * Fetches one file by its ID.
   * @param id the file ID.
   * @returns a file or null.
  */
  static async getById(id: string): Promise<any> {
    let file = await CacheService.GetItem(id);
    if (file) {
      return file;
    }
    file = await prisma.file.findUnique({
      where: { id, deleted: false },
    });
    if (file) {
      CacheService.SetItem(file.id, file);
    }
    return file;
  }

  /**
   * Fetches one file by the provided data.
   * @param data.
   * @returns a file or null.
  */
  static async getOne(data: any): Promise<any> {
    const file = await prisma.file.findFirst({
      where: { ...data, deleted: false },
    });
    if (file) {
      CacheService.SetItem(file.id, file);
    }
    return file;
  }

  /**
   * Fetches one file by its ID.
   * @param id the file ID.
   * @returns a file or null.
  */
  static async update(id: string, data: any): Promise<any> {
    const file = await prisma.file.update({
      where: { id },
      data,
    });
    CacheService.SetItem(file.id, file);
    return file;
  }

  /**
   * Add a history object for a file.
   * @param fileId the file ID.
   * @param action action to be performed on file.
   * @returns a file or null.
  */
  static async addFileHistory(fileId: string, action: FileAction): Promise<any> {
    const fileHistory = await prisma.fileHistory.create({
      data: { action, fileId },
    });
    return fileHistory;
  }

  /**
   * Get file history.
   * @param fileId the file ID.
   * @returns a file or null.
  */
  static async getFileHistory(fileId: string): Promise<any> {
    const fileHistory = await prisma.fileHistory.findMany({
      where: { fileId },
    });
    return fileHistory;
  }

  /**
   * Deletes one file by its ID.
   * @param id the file ID.
   * @returns
  */
  static async delete(id: string): Promise<void> {
    await prisma.file.update({
      where: { id },
      data: { deleted: true },
    });
    CacheService.DeleteItem(id);
  }
}
