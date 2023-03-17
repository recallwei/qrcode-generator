const DEFAULT_PLACEHOLDER = "--"

export const withPlaceholder = (text: string | undefined, placeholder = DEFAULT_PLACEHOLDER) =>
  text ?? placeholder
