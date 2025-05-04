# Serika.dev Developer Portal

This is the Developer Portal for Serika.dev, providing a dashboard to manage API keys, access usage statistics, and test the API through an interactive playground.

## Features

- **API Key Management:** Create, enable/disable, and delete API keys
- **Usage Statistics:** View token usage and API request metrics
- **API Playground:** Test text and image generation in real-time
- **Documentation:** Access detailed API documentation and code examples

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Serika.dev backend running locally or in a remote environment

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/serika-dev-developer-portal.git
cd serika-dev-developer-portal
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3500
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

Adjust the API base URL to match your Serika.dev backend location.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Integration

This dashboard connects to the Serika.dev API, which provides:

- Text generation via various language models
- Image generation through stable diffusion models
- Character integration for personalized responses
- Usage tracking and billing management

## License

[MIT](LICENSE)

## Acknowledgments

- This project was built with [Next.js](https://nextjs.org/)
- UI components powered by [Tailwind CSS](https://tailwindcss.com/)
