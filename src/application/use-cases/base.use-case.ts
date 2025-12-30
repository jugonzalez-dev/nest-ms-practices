/**
 * Base class for use cases
 * Provides common functionality for all use cases
 */
export abstract class BaseUseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}

