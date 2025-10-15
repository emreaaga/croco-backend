import z from 'zod';

const ApplicationSchema = z
  .object({
    name: z.string().min(3).toLowerCase(),
    siteUrl: z.url(),
    email: z.email().toLowerCase(),
    phoneNumber: z.string().min(3).trim(),
  })
  .strict();

export const validateCreateApplication = async (request, response, next) => {
  const data = request.body;
  const result = ApplicationSchema.safeParse(data);

  if (!result.success) {
    return response.status(400).json({
      success: false,
      message: z.prettifyError(result.error),
    });
  }
  request.validatedData = result.data;
  next();
};
