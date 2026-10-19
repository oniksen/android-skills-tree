export type Unsubscribe = () => void;

export interface Observer<T> {
  next: (value: T) => void;
  error?: (error: unknown) => void;
}
