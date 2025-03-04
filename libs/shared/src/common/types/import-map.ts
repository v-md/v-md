export interface ImportMap {
  imports?: Record<string, string | undefined>
  scopes?: Record<string, Record<string, string>>
}
