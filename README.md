# Valentine's Day Proposal Page 💕

A romantic and interactive Valentine's Day proposal web page built with Next.js, TypeScript, and React.

## Features

- 💖 Interactive "Yes" button that grows when clicked
- 😢 "No" button that runs away when you try to hover/click it
- 🎉 Celebration animation with confetti
- 💕 Floating hearts background animation
- 📱 Fully responsive design for mobile and desktop
- ✨ Smooth animations and transitions

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **React 18** - UI library
- **CSS3** - Styling and animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
.
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── ValentinePage.tsx        # Main component
│   └── ValentinePage.module.css # Component styles (empty, using globals)
├── package.json
├── tsconfig.json
└── next.config.js
```

## License

MIT