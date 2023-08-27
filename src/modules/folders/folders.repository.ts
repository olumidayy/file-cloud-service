import CacheService from '../../services/cache.service';
import prisma from '../../../prisma/client';

export default class FolderRepository {
  static async create(data: any): Promise<any> {
    const newFolder = await prisma.folder.create({
      data,
    });
    CacheService.SetItem(newFolder.id, newFolder);
    return newFolder;
  }

  /**
   * Fetches many folders based on given data.
   * @param
   * @returns list of folders
  */
  static async getMany(data?: any): Promise<any[]> {
    const folders = await prisma.folder.findMany({
      where: data || {},
    });
    return folders;
  }

  /**
   * Fetches one folder by its ID.
   * @param id the folder ID.
   * @returns a folder or null.
  */
  static async getById(id: string): Promise<any> {
    let folder = await CacheService.GetItem(id);
    if (folder) {
      return folder;
    }
    folder = await prisma.folder.findUnique({
      where: { id, deleted: false },
      include: { files: true },
    });
    if (folder) {
      CacheService.SetItem(folder.id, folder);
    }
    return folder;
  }

  /**
   * Fetches one folder by the provided data.
   * @param data.
   * @returns a folder or null.
  */
  static async getOne(data: any): Promise<any> {
    const folder = await prisma.folder.findFirst({
      where: { ...data, deleted: false },
      include: { files: true },
    });
    if (folder) {
      CacheService.SetItem(folder.id, folder);
    }
    return folder;
  }

  /**
   * Updates one folder by its ID.
   * @param id the folder ID.
   * @returns a folder or null.
  */
  static async update(id: string, data: any): Promise<any> {
    const folder = await prisma.folder.update({
      where: { id },
      data,
    });
    CacheService.SetItem(folder.id, folder);
    return folder;
  }

  /**
   * Deletes one folder by its ID.
   * @param id the folder ID.
   * @returns
  */
  static async delete(id: string): Promise<void> {
    await prisma.folder.update({
      where: { id },
      data: { deleted: true },
    });
    CacheService.DeleteItem(id);
  }
}
