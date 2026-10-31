# Aadab

> My excellent Nuxt.js project

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

# aadab-client

## Bulk Product Upload Feature

This project now includes a bulk product upload feature that allows users to upload multiple products at once using Excel or CSV files.

### How to Use

1. Navigate to the Products section in the sidebar
2. Click on "Bulk Upload"
3. Download the template file to see the required format
4. Fill in your product data following the template structure
5. Upload the completed file using the upload interface
6. Preview the data in the table before processing
7. Click "Upload file" to process the products

### Template Structure

The template file requires the following columns:

- name: Product name
- description: Product description
- price: Product price
- quantity: Product quantity
- category_id: Category ID
- unit_id: Unit ID
- sku: Stock keeping unit
- barcode: Product barcode
- is_active: Product status (1 for active, 0 for inactive)

### Backend Integration

The frontend connects to the backend API endpoints:

- `/organizations/{id}/crude_products` for retrieving products
- `/organizations/{id}/upload_product` for file upload
- `/organizations/{id}/process_product` for processing
- `/organizations/{id}/truncate_products` for deleting pending data
