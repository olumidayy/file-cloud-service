import { Folder } from '@prisma/client';
import { APIError } from '../../common';
import FolderRepository from './folders.repository';

export default class FolderService {
  /**
   * Fetches folders.
   * @param
   * @returns list of folders
  */
  static async createFolder(data: any): Promise<Folder[]> {
    const exists = await FolderRepository.getOne({
      userId: data.userId,
      name: data.name,
    });
    if (exists) {
      throw new APIError({
        message: 'You already own a folder with this name.',
        code: 400,
      });
    }
    const folder = await FolderRepository.create(data);
    return folder;
  }

  /**
   * Fetches folders.
   * @param
   * @returns list of folders
  */
  static async getAllFolders(): Promise<Folder[]> {
    const folders = await FolderRepository.getMany();
    return folders;
  }

  /**
   * Fetches one folder by its ID.
   * @param id the folder ID.
   * @returns a folder or null.
  */
  static async getFolderById(id: string): Promise<Folder> {
    const folder = await FolderRepository.getById(id);
    if (!folder) {
      throw new APIError({ message: 'Folder not found.', code: 404 });
    }
    return folder;
  }

  /**
   * Fetches a user's folders.
   * @param id the user ID.
   * @returns a folder or null.
  */
  static async getFoldersByUserId(userId: string): Promise<Folder[]> {
    const folders = await FolderRepository.getMany({ userId });
    return folders;
  }

  /**
 * Updates one file by its ID.
 * @param id the file ID.
 * @returns
*/
  static async updateFolder(id: string, data: any): Promise<void> {
    let folder = await FolderRepository.getById(id);
    if (!folder) {
      throw new APIError({ message: 'Folder not found.', code: 404 });
    }
    folder = await FolderRepository.update(id, data);
    return folder;
  }

  /**
   * Deletes one folder by its ID.
   * @param id the folder ID.
   * @returns
  */
  static async deleteFolder(id: string): Promise<void> {
    const folder = await FolderRepository.getById(id);
    if (!folder) {
      throw new APIError({ message: 'Folder not found.', code: 404 });
    }
    await FolderRepository.delete(id);
  }
}
