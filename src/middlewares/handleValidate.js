import z from 'zod';

export const handleValidate = (validateSchema, query = false) => {
  return (request, response, next) => {
    let result;
    if (query) {
      result = validateSchema.safeParse(request.query);
    } else {
      result = validateSchema.safeParse(request.body);
    }

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: z.prettifyError(result.error),
        code: 'VALIDATION_ERROR',
      });
    }
    request.validatedData = result.data;
    next();
  };
};
