This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Transvibe transcription API

An API and test page are available to transcribe uploaded audio using OpenAI.

### Setup

1. Add your OpenAI API key to a local env file:

```
OPENAI_API_KEY=sk-...your-key...
# optional: override model (default: whisper-1)
OPENAI_TRANSCRIBE_MODEL=whisper-1
```

For Next.js app router, place this in a `.env.local` file in the project root. Restart the dev server after changes.

### Usage

- Test page: navigate to `/transvibe` and upload an audio file.
- API endpoint: `POST /api/transvibe` with `multipart/form-data` field `file`.

### Processing

- Uploaded audio is transcoded to Opus (`.ogg`) if needed and segmented into ~10 minute chunks for stability.
- Each chunk is transcribed with OpenAI (`whisper-1` by default).
- Segments are merged and returned as JSON: `{ text, segments, model }`.

### Notes

- Requires ffmpeg; the project uses `ffmpeg-static` to bundle a binary in most environments.
- Large files will take time and memory; consider platform limits for serverless deploys. The route declares `runtime = "nodejs"` and `dynamic = "force-dynamic"` to favor Node runtimes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
