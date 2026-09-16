import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [{ ignores: ['.next/**', 'lib/generated/**'] }, ...nextCoreWebVitals]

export default config
