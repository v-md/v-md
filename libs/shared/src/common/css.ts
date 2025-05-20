export function cssClassName(...names: string[]) {
  return names.join('-')
}

export function cssVarName(...names: string[]) {
  return `--${cssClassName(...names)}`
}
