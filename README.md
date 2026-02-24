# Event Finder Web App

This is a modern web application built with Next.js for discovering, reviewing, and managing events in your city. Users can search for events, filter by category, view details, and submit reviews.

Website url : https://localpulse.lingadevaru.in/

## Features

- Search for nearby events based on your location
- Filter events by category, date, and rating
- View detailed information about each event
- Submit and read reviews for events
- Create and manage your own events (future feature)
- Real-time event updates and notifications
- User-friendly interface with dark/light mode support
- Mobile-responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Clerk
- **Database**: Firebase
- **Deployment**: Vercel

## Getting Started

To download and run this web app locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lingadevaru-hp/localpulse-app.git
   cd localpulse-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
localpulse-app/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions and helpers
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── docs/            # Project documentation
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Contributors

- [darshannaik484 (Darshan)](https://github.com/darshannaik484) — Fixed the review button issue, improved security policy, and contributed to documentation.
- [AkshaySArun (Akshay)](https://github.com/AkshaySArun) — Contributed to project documentation and README improvements.
- [lingadevaru-hp (Linga Devaru HP)](https://github.com/lingadevaru-hp) — Project owner and maintainer.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

ok friends lets hack it
