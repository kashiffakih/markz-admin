# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aadab Client is a Nuxt.js 2.x admin panel for an e-commerce/order management platform. It's a multi-tenant SPA with role-based access control, built with Vue 2.x, Vuetify 1.x, and AdminLTE 3.x.

## Commands

### Development
```bash
npm run dev          # Start dev server on port 3061
npm run build        # Build for production
npm run generate     # Generate static site
npm run start        # Start production server
```

### API Configuration
Development API: `http://localhost:9090/api` (configured in nuxt.config.js)

## Architecture

### Multi-Tenant Pattern
- Organizations (companies) are the top-level entity
- Every API request includes `company-id` header set by middleware
- URL structure: `/organizations/:organizationId/resource`
- Organization context stored in Vuex and persisted in localStorage

### Authentication Flow
1. Login via `/auth/login` → receives token
2. Token stored by @nuxtjs/auth module
3. Axios interceptor adds Bearer token to all requests
4. Organization middleware checks/sets company context

### State Management (Vuex)
```javascript
store/
  auth.js       // User authentication (@nuxtjs/auth)
  validation.js // API validation errors
  settings.js   // Organization, city, mediaUrl, config
```

### Global Mixins
All components have access to:
- `authenticated`, `user` - Auth state
- `errors` - Validation errors object
- `organization`, `city`, `mediaUrl` - Settings

### CRUD Pattern
Standard pattern used across all resource pages:
```javascript
// In pages/resource/index.vue
async getData() {
  const { data } = await this.$axios.get('/api/resource')
  this.items = data.data
}

// In pages/resource/create.vue
async create() {
  await this.$axios.post('/api/resource', this.form)
  this.$router.push('/resource')
}

// In pages/resource/_id.vue
async update() {
  await this.$axios.put(`/api/resource/${this.$route.params.id}`, this.form)
}
```

### Category Hierarchy
Categories support 4 levels of nesting:
1. Main Category
2. Sub Category
3. Sub Sub Category
4. Sub Sub Sub Category

Navigation pattern: `/categories/:id/sub-categories/:id/sub-sub-categories/:id/sub-sub-sub-categories`

### Error Handling
- Validation errors from API (422) are stored in Vuex
- Access via `this.errors` in any component
- Cleared automatically by `clearValidationErrors` middleware
- Display pattern: `<span class="error">{{ errors.field_name }}</span>`

## File Structure

```
components/          # Reusable Vue components
layouts/
  default.vue       # Main authenticated layout with sidebar
middleware/
  organization.js   # Sets organization context
  guest.js         # Redirects authenticated users
pages/             # File-based routing
  organizations/_organizationId/  # Nested dynamic routes
plugins/
  mixins/          # Global mixins
  axios.js         # API interceptors
store/             # Vuex modules
```

## Component Patterns

### Select Components
Reusable droppers in `components/`:
- `select-organization.vue` - Organization dropdown
- `select-city.vue` - City selector
- `select-category.vue` - Category selector with hierarchy

### Rich Text Editor
Use `components/editor.vue` which wraps CKEditor 5 with math support:
```vue
<editor v-model="form.description" />
```

### Data Tables
Standard pattern with AdminLTE DataTable:
```javascript
mounted() {
  this.getData()
},
methods: {
  async getData() {
    const { data } = await this.$axios.get('/api/resource')
    this.items = data.data
    this.$nextTick(() => {
      $('#dataTable').DataTable()
    })
  }
}
```

## Deployment

### CI/CD Pipeline
GitHub Actions deploys to production on push to `main`:
1. Generates config files from secrets
2. Builds static site (`npm run generate`)
3. Deploys to DigitalOcean server via SSH
4. Updates Apache virtual host symlink

### Environment Files
These files are gitignored and generated during deployment:
- `nuxt.config.js` - API URLs, auth config
- `store/settings.js` - Media URLs, API endpoints
- `deployment-config.json` - Server paths, SSH config

## Known Issues & Considerations

1. **Legacy Dependencies**: Using Nuxt 2.x, Vue 2.x, Vuetify 1.x (not latest versions)
2. **Mixed UI Frameworks**: Both Vuetify and AdminLTE are used (potential CSS conflicts)
3. **Large Static Assets**: 51MB of jQuery plugins in `/static/plugins/`
4. **No TypeScript**: Pure JavaScript codebase
5. **No Tests**: No test framework configured
6. **OpenSSL Legacy**: Requires `NODE_OPTIONS=--openssl-legacy-provider` for builds

## API Headers

All authenticated requests include:
```javascript
{
  'Authorization': 'Bearer <token>',
  'company-id': organizationId  // Set by middleware
}
```

## Development Tips

1. Always check organization context before API calls
2. Use `this.errors.field_name` for validation error display
3. DataTables must be initialized after DOM updates with `this.$nextTick()`
4. SSR is disabled for certain components (carousel3d, vue-json-excel, etc.)
5. When adding new pages under organizations, follow the `_organizationId` nested routing pattern