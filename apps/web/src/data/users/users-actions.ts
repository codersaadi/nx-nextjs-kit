'use server';
import { GetAllUserSchemaInput } from './users.schema';
import { userRepository } from './users';

export type GetAllUsersType = Awaited<
  ReturnType<typeof userRepository.getAllUsers>
>['data'][0];

export const getUsersAction = async (input: GetAllUserSchemaInput) => {
  return await userRepository.getAllUsers(input);
};
