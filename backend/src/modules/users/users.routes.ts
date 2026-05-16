import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { CreateUserDTO, UpdateUserDTO, UserListQuery } from './users.types';
import { createUserBodyJsonSchema } from './schemas/createUser.schema';
import { usersListQueryJsonSchema } from './schemas/userListQuery.schema';
import { findUserParamJsonSchema } from './schemas/findUserParam.schema';
import { updateUserBodyJsonSchema } from './schemas/updateUser.schema';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
} from './users.service';

export async function usersRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.post<{ Body: CreateUserDTO }>(
      '/users',
      {
        schema: {
          body: createUserBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const createdUser = await createUser(request.body, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, createdUser);
      },
    );

    panel.get<{ Querystring: UserListQuery }>(
      '/users',
      {
        schema: {
          querystring: usersListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await getAllUsers(
          {
            organizationId: user.organizationId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, page);
      },
    );

    panel.get<{ Params: { userId: string } }>(
      '/users/:userId',
      {
        schema: {
          params: findUserParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { userId } = request.params;

        const foundUser = await getUserById(userId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, foundUser);
      },
    );

    panel.put<{ Params: { userId: string }; Body: UpdateUserDTO }>(
      '/users/:userId',
      {
        schema: {
          params: findUserParamJsonSchema,
          body: updateUserBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { userId } = request.params;

        const updatedUser = await updateUser(userId, request.body, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, updatedUser);
      },
    );

    panel.delete<{ Params: { userId: string } }>(
      '/users/:userId',
      {
        schema: {
          params: findUserParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { userId } = request.params;

        const result = await deleteUserById(userId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, result);
      },
    );
  });
}