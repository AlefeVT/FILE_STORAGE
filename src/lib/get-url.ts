export function getUrl(path?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''

    console.log(baseUrl);
    const normalizedPath = path && !path.startsWith('/') ? `/${path}` : path || ''
    return `${baseUrl}${normalizedPath}`
  }
  