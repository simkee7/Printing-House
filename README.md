# Printing House

A web system that acts as a platform for print shops — it allows efficient management of resources and tracking of user activity.

## Project Description

The system connects clients (individuals and companies) with print shops. Clients can search for and order printed products (t-shirts, mugs, roll-up banners, business cards, etc.), personalize them (text/image), pay for orders, and track their status. Print shops manage their product offerings, stock levels, and order fulfillment. The admin approves new users, manages product categories, and views business statistics through charts.

## User Roles

- **Clients** — individuals and companies
- **Printers** — owners/representatives of print shops
- **Admin** — manages the system

## Key Features

- Login and registration, with admin approval for new clients and printers; password reset via a temporary link
- Public product search by name and category, with sorting and detail view
- Detailed product view — price, colors, available print types, print shop location on a map, image gallery
- Product personalization (adding text or an image that gets rendered on the product) and adding to the cart
- Ordering with status tracking (ordered → paid → printing → shipped → received) and PDF invoice generation
- Test/sandbox payment (Stripe Test Mode / PayPal Sandbox)
- Public tenders and bidding for company clients
- Rating (like/dislike) and comments on received products
- Printer panel — managing products, services, stock levels, and importing stock lists from a JSON file
- Admin panel — managing users, product categories, and business statistics (charts)

## Tech Stack

The project was built using the **MEAN** stack:

- **M**ongoDB
- **E**xpress.js
- **A**ngular
- **N**ode.js

## AI Assistance

The AI tool (Claude) was used during development, specifically for:
- part of the system architecture related to sending emails (e.g., notifications, delivering invoices)
- generating PDF documents (invoices, reports)
- implementing time-limit logic (e.g., password reset deadline, tender duration)
- web page design
