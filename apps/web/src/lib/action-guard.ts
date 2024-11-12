import { auth } from '../auth';
import { type TShapeErrorFn, createServerActionProcedure } from 'zsa';
import { AuthenticationError, PublicError, UnAuthorizedError } from './errors';
import { getCurrentUser } from './get-user';
import { rateLimitByKey } from './limiter';
import { type RolesArrayGuardSchema, roleArrayGuardSchema } from './rbac-array';
import { SessionUser } from './auth';

// Function to shape errors based on the environment and error type.
// In development, all errors pass through to the UI for easier debugging.
// In production, only public errors are allowed to pass, while others return a generic error message.
function shapeErrors({ err }: { err: ReturnType<TShapeErrorFn> }) {
  const isAllowedError = err instanceof PublicError;
  const isDev = process.env.NODE_ENV === 'development';
  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? 'ERROR',
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${
        err.message
      }`,
    };
  }
  return {
    code: 'ERROR',
    message: 'Something went wrong',
  };
}

// This authenticated action is designed for database mutation actions.
// It checks if the user is authenticated and applies a global rate limiter to prevent abuse.
// Rate limiter here limits the number of requests the authenticated user can make in a given time window.
export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const session = await auth();
    if (!session || !session?.user || !session.user.id)
      throw new AuthenticationError();
    const { user } = session;

    // Apply a rate limit on all actions that mutate the database.
    await rateLimitByKey({
      key: `${user.id}-global`,
      limit: 10,
      window: 10000, // 10 requests per 10 seconds
    });

    return { user } as { user: SessionUser };
  });

// This is an unauthenticated action, also applying rate-limiting, but for unauthenticated users.
// Typically used in cases where limited operations are allowed for unauthenticated users.
export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    await rateLimitByKey({
      key: 'unauthenticated-global',
      limit: 10,
      window: 10000, // 10 requests per 10 seconds
    });
  });

// Guards are used here for actions that modify data and require role validation.
// They validate the role of the authenticated user before performing a database mutation.
// Rate limiting is applied since these actions impact the database.

// Authorize action guard for role-based access control (RBAC).
// This checks if the authenticated user has one of the allowed roles to perform a mutation.
export const authorizeActionGuard = createServerActionProcedure(
  authenticatedAction
)
  .input(roleArrayGuardSchema) // Accepts an array of allowed roles.
  .handler(async ({ input, ctx: { user } }) => {
    const validatedUser = validateRole(input, user);
    if (!validatedUser) throw new UnAuthorizedError(); // Throws an error if the user’s role is unauthorized.
    return validatedUser; // Returns the user if authorized.
  });

// Helper function to validate the user's role against the allowed roles.
// This is used internally by the action guards to verify the user’s role.
const validateRole = (input: RolesArrayGuardSchema, user: SessionUser) => {
  if (input.requiredRoles.includes(user.role)) {
    return { user }; // If the user's role is in the allowed list, return the user.
  }
  return null; // If not, return null (unauthorized).
};
// Separate validation function specifically for UI rendering purposes.
// This is used when we need to validate the user's role without applying rate limits.
// It's ideal for rendering protected UI elements based on role (e.g., hiding/showing buttons or content).
// The reason to separate it from action guards is to avoid unnecessary rate limiting when validating roles for UI.
// Rendering multiple UI elements (e.g., multiple role checks) could trigger the rate limiter, which is not desirable.
export async function validateRoleAction(allowedRoles: RolesArrayGuardSchema) {
  const rolesInput = roleArrayGuardSchema.safeParse(allowedRoles);
  if (rolesInput.error)
    return {
      user: null,
      error: {
        name: rolesInput.error.name,
        stack: rolesInput.error.stack,
        message: rolesInput.error.message,
      },
    };
  const { user, error } = await getCurrentUser(); // Get the current user session.
  if (!user) return { user: null, error }; // If no user is found, return null and the error.

  const validatedUser = validateRole(rolesInput.data, user); // Validate the user's role.
  if (!validatedUser) return { user: null, error: new UnAuthorizedError() }; // If unauthorized, return an error.

  return { user, error: null }; // Return the user if authorized.
}
