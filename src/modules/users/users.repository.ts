import CacheService from '../../services/cache.service';
import prisma from '../../../prisma/client';

export default class UserRepository {
  static allowedFields = {
    id: true, firstname: true, lastname: true, email: true, folders: true, role: true,
  };

  static async create(data): Promise<any> {
    const newUser = await prisma.user.create({
      data,
      select: this.allowedFields,
    });
    CacheService.SetItem(newUser.id, newUser);
    return newUser;
  }

  /**
   * Fetches all users.
   * @param
   * @returns list of users
  */
  static async getAll(): Promise<any[]> {
    const users = await prisma.user.findMany({
      select: this.allowedFields,
    });
    return users;
  }

  /**
   * Fetches one user by their ID.
   * @param id the user ID.
   * @returns a user or null.
  */
  static async getById(id: string): Promise<any> {
    let user = await CacheService.GetItem(id);
    if (user) {
      return user;
    }
    user = await prisma.user.findUnique({
      where: { id, deleted: false },
      select: { ...this.allowedFields, files: true },
    });
    if (user) {
      CacheService.SetItem(user.id, user);
    }
    return user;
  }

  /**
   * Fetches one user by the provided data.
   * @param data.
   * @returns a user or null.
  */
  static async getOne(data: any): Promise<any> {
    const user = await prisma.user.findFirst({
      where: { ...data, deleted: false },
      select: { ...this.allowedFields, files: true },
    });
    if (user) {
      CacheService.SetItem(user.id, user);
    }
    return user;
  }

  /**
   * Fetches one user by the user's email.
   * @param data.
   * @returns a user or null.
  */
  static async getByEmail(email: string): Promise<any> {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), deleted: false },
    });
    if (user) {
      CacheService.SetItem(user.id, user);
    }
    return user;
  }

  /**
   * Fetches one user by their ID.
   * @param id the user ID.
   * @returns a user or null.
  */
  static async update(id: string, data: any): Promise<any> {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: this.allowedFields,
    });
    CacheService.SetItem(user.id, user);
    return user;
  }

  /**
   * Deletes one user by their ID.
   * @param id the user ID.
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
