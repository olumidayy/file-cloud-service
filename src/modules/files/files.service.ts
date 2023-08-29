import {
  File, FileAction, FileHistory, Flag,
} from '@prisma/client';
import config from '../../config';
import { APIError, logger } from '../../common';
import FlagRepository from '../flags/flags.repository';
import FileRepository from './files.repository';

export default class FileService {
  /**
   * Fetches files.
   * @param
   * @returns list of files
  */
  static async createFile(data: any): Promise<File> {
    try {
      const file = await FileRepository.create(data);
      return file;
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'An error occured while creating file.', code: 400 });
    }
  }

  /**
   * Fetches files.
   * @param
   * @returns list of files
  */
  static async getAllFiles(): Promise<File[]> {
    const files = await FileRepository.getMany();
    return files;
  }

  /**
   * Fetches one file by its ID.
   * @param id the file ID.
   * @returns a file or null.
  */
  static async getFileById(id: string): Promise<File> {
    const file = await FileRepository.getById(id);
    if (!file) {
      throw new APIError({ message: 'File not found.', code: 404 });
    }
    return file;
  }

  /**
   * Fetches one file by its ID.
   * @param id the file ID.
   * @returns a file or null.
  */
  static async getOneFile(data: any): Promise<File> {
    const file = await FileRepository.getOne(data);
    return file;
  }

  /**
   * Fetches a user's files.
   * @param id the user ID.
   * @returns a file or null.
  */
  static async getFilesByUserId(userId: string): Promise<File[]> {
    const files = await FileRepository.getMany({ userId });
    return files;
  }

  /**
   * Updates one file by its ID.
   * @param id the file ID.
   * @returns
  */
  static async updateFile(id: string, data: any): Promise<File> {
    let file = await FileRepository.getById(id);
    if (!file) {
      throw new APIError({ message: 'File not found.', code: 404 });
    }
    file = await FileRepository.update(id, data);
    return file;
  }

  /**
   * Mark a file as unsafe.
   * @param id the file ID.
   * @returns
  */
  static async flagFile(fileId: string, flaggerId: string): Promise<Flag> {
    const fileExists = await FileRepository.getById(fileId);
    if (!fileExists) {
      throw new APIError({ message: 'File not found.', code: 404 });
    }
    const flagged = await FlagRepository.getOne({ fileId, flaggerId });
    if (flagged) {
      return flagged;
    }
    const flag = await FlagRepository.create({ fileId, flaggerId });
    const file = await FileRepository.update(fileId, {
      flagCount: {
        increment: 1,
      },
    });
    if (file.flagCount === config.maxFlagCount) {
      await FileRepository.delete(fileId);
    }
    return flag;
  }

  /**
   * Mark a file as safe again.
   * @param id the file ID.
   * @returns
  */
  static async unflagFile(fileId: string, flaggerId: string): Promise<void> {
    const flagged = await FlagRepository.getOne({ fileId, flaggerId });
    if (!flagged) {
      throw new APIError({
        message: 'This file wasn\'t flagged by this user.',
        code: 400,
      });
    }
    await FlagRepository.delete(flagged.id);
    await FileRepository.update(fileId, {
      flagCount: {
        decrement: 1,
      },
    });
  }

  /**
   * Add a history object for a file.
   * @param fileId the file ID.
   * @param action action to be performed on file.
   * @returns a file or null.
  */
  static async addFileHistory(fileId: string, action: FileAction): Promise<FileHistory> {
    try {
      const fileHistory = await FileRepository.addFileHistory(fileId, action);
      return fileHistory;
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Error occurred while creating file history', code: 400 });
    }
  }

  /**
   * Get file history.
   * @param fileId the file ID.
   * @returns a file or null.
  */
  static async getFileHistory(fileId: string): Promise<any> {
    try {
      const history = await FileRepository.getFileHistory(fileId);
      return history;
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Error occurred while creating delete history', code: 400 });
    }
  }

  /**
   * Deletes one file by its ID.
   * @param id the file ID.
   * @returns
  */
  static async deleteFile(id: string): Promise<string> {
    const file = await FileRepository.getById(id);
    if (!file) {
      throw new APIError({ message: 'File not found.', code: 404 });
    }
    await FileRepository.delete(id);
    return file.key;
  }
}
