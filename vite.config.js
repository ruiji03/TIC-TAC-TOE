
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY
const repositoryName = repository?.split('/')[1]
const base =
  process.env.GITHUB_ACTIONS && repositoryName && !repositoryName.endsWith('.github.io')
    ? `/${repositoryName}/`
    : '/'

export default defineConfig({
  plugins: [react()],
  base
})
