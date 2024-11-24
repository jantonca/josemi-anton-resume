export * from './theme'
export * from './components'
export * from './layout'
export * from './pages'
export * from './sections'

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
