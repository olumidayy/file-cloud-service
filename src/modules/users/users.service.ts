import { User, UserRole } from '@prisma/client';
import { APIError, logger } from '../../common';
import UserRepository from './users.repository';

export default class UserService {
  /**
   * Fetches all users.
   * @param
   * @returns list of users
  */
  public static async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserRepository.getAll();
      return users;
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'An error occurred while fetching users.', code: 400 });
    }
  }

  /**
   * Fetches one user by their ID.
   * @param id the user ID.
   * @returns a user or null.
  */
  public static async getUserById(id: string): Promise<User> {
    try {
      const user = await UserRepository.getById(id);
      if (!user) {
        throw new APIError({ message: 'User does not exist.', code: 404 });
      }
      return user;
    } catch (error) {
      logger.error(error);
      if (error.code) throw error;
      throw new APIError({ message: 'An error occurred while getting user.', code: 400 });
    }
  }

  /**
   * Updates one user by their ID.
   * @param id the user ID.
   * @returns
  */
  public static async updateUser(id: string, data: any): Promise<User> {
    let user = await UserRepository.getById(id);
    if (!user) {
      throw new APIError({ message: 'User not found.', code: 404 });
    }
    user = await UserRepository.update(id, data);
    return user;
  }

  /**
   * Change a user's role.
   * @param id the user ID.
   * @returns
  */
  public static async changeUserRole(id: string, role: UserRole): Promise<User> {
    let user = await UserRepository.getById(id);
    if (!user) {
      throw new APIError({ message: 'User not found.', code: 404 });
    }
    user = await UserRepository.update(id, { role });
    return user;
  }

  /**
   * Deletes one user by their ID.
   * @param id the user ID.
   * @returns
  */
  public static async deleteUser(id: string): Promise<void> {
    try {
      const user = await UserRepository.getById(id);
      if (!user) {
        throw new APIError({ message: 'User does not exist.', code: 404 });
      }
      await UserRepository.delete(id);
    } catch (error) {
      logger.error(error);
      if (error.code) throw error;
      throw new APIError({ message: 'An error occurred while deleting user.', code: 400 });
    }
  }
}
