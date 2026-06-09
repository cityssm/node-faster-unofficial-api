import eslintConstants from '@cityssm/faster-constants/other/eslint'
import eslintConfigCityssm, {
  defineConfig,
  type Config
} from 'eslint-config-cityssm'
import { cspellWords } from 'eslint-config-cityssm/exports.js'

const config = defineConfig(eslintConfigCityssm, {
  files: ['**/*.ts'],
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        cspell: {
          words: [...cspellWords, ...eslintConstants.cspellWords]
        }
      }
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off'
  }
}) as Config

export default config
