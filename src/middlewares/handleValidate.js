import z from 'zod';

export const handleValidate = validateSchema => {
  return (request, response, next) => {
    const result = validateSchema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: z.prettifyError(result.error),
      });
    }

    request.validatedData = result.data;
    next();
  };
};
