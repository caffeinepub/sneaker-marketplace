# Sneaker Marketplace

## Current State
Empty project with default Motoko backend and React frontend scaffolding.

## Requested Changes (Diff)

### Add
- Sneaker product catalog with sample listings (name, brand, price, sizes, images, description, category)
- Home page with hero section and featured products
- Product listing page with filter by brand/category and sort by price
- Product detail page
- Shopping cart (client-side state)
- Checkout flow (order summary, form)
- User authentication (login/signup via Internet Identity)
- Admin panel for managing sneaker listings (add, edit, delete)
- Role-based access: admin vs regular user

### Modify
- Default backend actor: add sneaker CRUD, orders, user roles
- Default frontend: replace with full marketplace UI

### Remove
- Default placeholder content

## Implementation Plan
1. Select authorization component for login + role-based access
2. Generate Motoko backend: sneaker CRUD, order management, admin role
3. Build frontend: home, catalog, product detail, cart, checkout, admin panel
