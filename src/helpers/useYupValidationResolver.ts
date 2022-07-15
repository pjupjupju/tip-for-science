import { useCallback } from 'react';
import { AnySchema, ValidationError } from 'yup';

const useYupValidationResolver = (
  validationSchema: AnySchema,
  setErrorsCallback: (errors: Array<{ error: string }>) => void
) =>
  useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        const errorObject = (errors as ValidationError).inner.reduce(
          (allErrors, currentError: ValidationError) => ({
            ...allErrors,
            [currentError.path as string]: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          }),
          {}
        );

        setErrorsCallback(
          Object.values<{ message: string }>(
            errorObject
          ).map((e: { message: string }) => ({ error: e.message }))
        );

        return {
          values: {},
          errors: errorObject,
        };
      }
    },
    [validationSchema, setErrorsCallback]
  );

export { useYupValidationResolver };
