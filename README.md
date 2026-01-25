# Harry's Personal Training - Next.js

A modern, full-stack personal training website built with Next.js, TypeScript, and Tailwind CSS. This website replaces the static HTML version and now supports dynamic content, API integrations, and backend functionality.

## Features

- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Responsive Design**: Beautiful mobile-first design with modern animations
- **API Routes**: Built-in backend API endpoints for form submissions and bookings
- **Server Components**: Optimized performance with React Server Components
- **Dynamic Pages**: Easy to connect to databases and external APIs
- **Form Handling**: Contact and booking forms with client-side validation

## Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── contact/      # Contact form endpoint
│   │   └── bookings/     # Booking endpoint
│   ├── (pages)/
│   │   ├── page.tsx      # Home page
│   │   ├── training/     # Training programs
│   │   ├── timetable/    # Class schedule
│   │   ├── results/      # Client results
│   │   ├── coach/        # About the coach
│   │   ├── contact/      # Contact form
│   │   └── book-consultation/ # Booking form
│   └── layout.tsx        # Root layout
├── components/
│   ├── Navigation.tsx    # Header navigation
│   └── Footer.tsx        # Footer
└── styles/
    └── globals.css       # Global styles and custom CSS

public/
├── images/               # Static images
├── logo.png              # Branding
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Key Technologies

- **Next.js**: React framework with built-in routing and API support
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: For state management

### Making API Calls

The site includes example form handlers that make API calls:

#### Contact Form
- **Endpoint**: `POST /api/contact`
- **Body**: `{ name, email, phone, message }`
- **Location**: `src/app/contact/page.tsx`

#### Booking Form
- **Endpoint**: `POST /api/bookings`
- **Body**: `{ name, email, phone, date, time, hasInjuries, injuries }`
- **Location**: `src/app/book-consultation/page.tsx`

### Extending the API

To add more API endpoints:

1. Create a new folder in `src/app/api/`
2. Add a `route.ts` file
3. Implement your handler:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Your logic here
  return NextResponse.json({ data: 'response' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Your logic here
  return NextResponse.json({ success: true });
}
```

## Features Ready for Enhancement

### 1. Database Integration
Connect to a database like PostgreSQL, MongoDB, or Firebase for:
- Storing user profiles
- Managing bookings
- Saving contact form submissions
- Caching testimonials and results

### 2. Authentication
Implement user authentication with:
- NextAuth.js for session management
- Google/GitHub OAuth integration
- User profile pages

### 3. Email Service
Send transactional emails with:
- SendGrid
- Nodemailer
- AWS SES
- Resend

### 4. Payment Processing
Add payment functionality with:
- Stripe for membership payments
- PayPal integration
- Package subscriptions

### 5. CMS Integration
Connect to a headless CMS:
- Sanity.io for content management
- Contentful
- Strapi
- WordPress API

### 6. Advanced Features
- Real-time notifications with WebSockets
- Image optimization with Next.js Image component
- Sitemap and SEO optimization
- Analytics integration (Google Analytics, Mixpanel)
- Live chat with Intercom or Zendesk
- Video streaming for workout tutorials

## Styling

The site uses custom CSS combined with Tailwind CSS utilities. Key color scheme:

- **Primary**: Lime (#c8ff00)
- **Dark Background**: #0a0a0a
- **Cards**: #1a1a1a
- **Text**: White/Gray

Customize colors in `src/styles/globals.css` and `tailwind.config.ts`

## Building for Production

1. Build the project:
```bash
npm run build
```

2. Run production server:
```bash
npm run start
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- **Netlify**: Connect your GitHub repo for automatic deployments
- **Docker**: Create a containerized deployment
- **Traditional Server**: Build and run with Node.js

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
EMAIL_API_KEY=your_email_service_key
STRIPE_PUBLIC_KEY=your_stripe_key
```

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Caching strategies
- CSS-in-JS optimization

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For questions or issues, check the documentation or create an issue in your repository.

## License

All rights reserved - Harry's Personal Training

---

**Next Steps**: 
1. Set up environment variables
2. Connect a database
3. Integrate email service
4. Add payment processing
5. Deploy to production
