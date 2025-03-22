# Coupon Distribution System

The Coupon Distribution System is a web application designed to distribute coupons to customers without requiring them to log in. This system ensures a seamless and user-friendly experience for both the distributor and the customer.

The system is built using the following technologies:

- **Next.js**: For the frontend
- **AdonisJS**: For the backend
- **TypeScript**: For type safety and better development experience

The application is hosted on:

- **Frontend**: Vercel
- **Backend**: Render

## Development

To get started with development, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mohitxskull/Coupon.git
   cd Coupon
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Setup environment variables**:

   - Create a `.env` file in the root directory of both the frontend and backend directories.
   - Use the `.env.example` file as a template to fill in the required environment variables.

4. **Start the development server**:
   ```bash
   pnpm run dev
   ```

## Implementation

### Coupon Distribution Logic

To ensure that each coupon is unique to a user and to prevent multiple claims of the same coupon, the system employs the following mechanisms:

1. **Locks**: The system uses locks to ensure that only one user can claim a coupon at a time. This prevents race conditions where multiple users might try to claim the same coupon simultaneously.

2. **Guest Sessions**: Each user is assigned a guest session. This session helps in tracking the user's activity without requiring them to log in.

3. **IP Blocking**: To prevent abuse, the system implements IP blocking. A user can only claim a coupon once a day from the same IP address. This helps in mitigating the risk of multiple claims from the same user.
