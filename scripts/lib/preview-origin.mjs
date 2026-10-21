/** @param {Record<string, string | undefined>} environment */
export function previewOrigin(environment = process.env) {
  if (!environment.CODESPACE_NAME) return 'http://localhost:3000'
  const name = environment.CODESPACE_NAME
  const domain = environment.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(domain)) {
    throw new Error('Érvénytelen Codespaces-hostnév. Nem írunk bizonytalan URL-t a konfigurációba.')
  }
  return `https://${name}-3000.${domain}`
}
