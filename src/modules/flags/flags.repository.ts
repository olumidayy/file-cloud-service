import { Flag } from '@prisma/client';
import prisma from '../../../prisma/client';

export default class FlagRepository {
  static async create(data: any): Promise<Flag> {
    const newFlag = await prisma.flag.create({
      data,
    });
    return newFlag;
  }

  /**
   * Fetches many Flags based on given data.
   * @param
   * @returns list of Flags
  */
  static async getMany(data?: any): Promise<any[]> {
    const Flags = await prisma.flag.findMany({
      where: { ...(data || {}), deleted: false },
    });
    return Flags;
  }

  /**
   * Fetches one Flag by its ID.
   * @param id the Flag ID.
   * @returns a Flag or null.
  */
  static async getById(id: string): Promise<any> {
    const flag = await prisma.flag.findUnique({
      where: { id, deleted: false },
    });
    return flag;
  }

  /**
   * Fetches one Flag by the provided data.
   * @param data.
   * @returns a Flag or null.
  */
  static async getOne(data: any): Promise<any> {
    const flag = await prisma.flag.findFirst({
      where: { ...data, deleted: false },
    });
    return flag;
  }

  /**
   * Deletes one Flag by its ID.
   * @param id the Flag ID.
   * @returns
  */
  static async delete(id: string): Promise<void> {
    await prisma.flag.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
