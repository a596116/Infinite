export interface InfiniteState {
  loaded: () => void
  complete: () => void
  error: () => void
}
