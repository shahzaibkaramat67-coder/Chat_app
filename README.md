# Chat App

A modern chat application built with Next.js, TypeScript and Tailwind CSS. This repository contains a modular frontend for building chat experiences, with optional Docker support.

## Features

- Next.js (App Router) + TypeScript
- Component-based UI for chat interactions
- Tailwind CSS for styling
- Docker and docker-compose configuration for local deployment
- Example environment and proxy helper files

## Repository structure

```
Chat_app/
├── app/                # Next.js app routes and pages
├── components/         # Reusable React components
├── public/             # Static assets
├── model/              # Model or chat-related utilities
├── Assets/             # Media and design assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
├── docker-compose.yml
├── dockerFile
└── README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm, yarn, or pnpm
- Docker (optional, for containerized runs)

## Installation

1. Clone the repository

```bash
git clone https://github.com/shahzaibkaramat67-coder/Chat_app.git
cd Chat_app
```

2. Install dependencies

```bash
npm install
# or
# yarn install
# or
# pnpm install
```

## Environment

Create a `.env.local` file at the project root for any runtime configuration. Example variables the app may use:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CHAT_PROVIDER=local
```

Do not commit secrets or keys to the repository.

## Development

Start the Next.js development server:

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

Open http://localhost:3000 in your browser.

## Production build

Build and start the app:

```bash
npm run build
npm run start
```

## Docker

To run locally using Docker:

```bash
docker-compose up --build
```

This will build the image and run the container(s) as defined in `docker-compose.yml`.

## Useful scripts

- `npm run dev` — Development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run linting (if configured)

Check `package.json` for the full list of scripts.

## Troubleshooting

- If styles are not applied, ensure Tailwind is configured and the build step ran successfully.
- If API calls fail, verify `NEXT_PUBLIC_API_URL` points to a running backend or proxy.

## Contributing

Contributions are welcome — please open issues or pull requests. When contributing, include a clear description of changes and any setup required to test them.

## License

No license file is present in the repository snapshot. If you want a license added, tell me which one to include (e.g., MIT, Apache-2.0) and I will add it.
