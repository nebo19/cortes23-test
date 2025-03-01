import { ZodError, ZodSchema } from 'zod';
import { response } from './response';

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: ReturnType<typeof response> };

export const parseData = <T>(
  schema: ZodSchema<T>,
  data: string
): ValidationResult<T> => {
  try {
    const parsedData = schema.parse(JSON.parse(data));
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: response(400, {
          message: 'Validation error',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        }),
      };
    } else {
      return {
        success: false,
        response: response(400, { message: 'Invalid data' }),
      };
    }
  }
};
