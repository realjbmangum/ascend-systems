-- =============================================================================
-- Import: project resources from app-heirloom → "Heirloom"
-- Generated: 2026-05-05T16:23:35.857Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-app-heirloom.sql
--
-- 2 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# heirloom
mvp for new app
', 90, 'app-heirloom/README.md'
FROM projects WHERE name = 'Heirloom' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores([''dist'']),
  {
    files: [''**/*.{ts,tsx}''],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: [''./tsconfig.node.json'', ''./tsconfig.app.json''],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from ''eslint-plugin-react-x''
import reactDom from ''eslint-plugin-react-dom''

export default defineConfig([
  globalIgnores([''dist'']),
  {
    files: [''**/*.{ts,tsx}''],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs[''recommended-typescript''],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: [''./tsconfig.node.json'', ''./tsconfig.app.json''],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
', 90, 'app-heirloom/apps/pwa/README.md'
FROM projects WHERE name = 'Heirloom' LIMIT 1;
