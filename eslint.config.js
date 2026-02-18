import eslint from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default typescriptEslint.config(
    { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
    {
        extends: [
            eslint.configs.recommended,
            ...typescriptEslint.configs.recommended,
            ...eslintPluginVue.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                defineProps: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                withDefaults: 'readonly',
            },
            parser: eslintPluginVue.parser,
            parserOptions: {
                parser: typescriptEslint.parser,
                extraFileExtensions: ['.vue'],
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "unused-imports": unusedImports,
            "vue": eslintPluginVue,
        },
        rules: {
            'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
            'object-curly-spacing': ['error', 'always'],
            'indent': ['error', 2],
            'no-trailing-spaces': 'error',
            'semi': ['error', 'never'],
            'new-parens': ['error'],
            'comma-dangle': ['error', 'always-multiline'],
            '@typescript-eslint/no-empty-interface': 0,
            'keyword-spacing': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'unused-imports/no-unused-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
            '@typescript-eslint/no-unused-vars': ['error', { 
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_'
            }],
            // Add Vue specific rules
            'vue/script-setup-uses-vars': 'error',
            'vue/no-unused-vars': ['error', {
                'ignorePattern': '^_'
            }],
        },
    },
);