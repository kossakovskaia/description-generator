# Description Generator

AI-powered web application for generating product documentation including epics, JPD ideas, and product updates.

## Features

- 🚀 **Epic Generator**: Create detailed, structured epics with user stories, goals, and acceptance criteria
- 💡 **JPD Idea Generator**: Transform ideas into well-structured JPD documents with opportunity statements, problem context, and impact analysis
- 📝 **Product Update Generator**: Convert multiple epics into polished release notes

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling
- **OpenAI API** - AI-powered text generation
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd desc-gen
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the Application

Development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:
```bash
npm run build
npm start
```

## Project Structure

```
desc-gen/
├── src/
│   └── app/
│       ├── api/                    # API routes
│       │   ├── generate-epic/
│       │   ├── generate-jpd-idea/
│       │   └── generate-product-update/
│       ├── components/             # React components
│       │   ├── EpicGenerator.tsx
│       │   ├── JpdIdeaGenerator.tsx
│       │   └── ProductUpdateGenerator.tsx
│       ├── lib/                    # Business logic
│       │   ├── generators/        # AI generation logic
│       │   ├── prompts/           # OpenAI prompts
│       │   ├── openai-client.ts   # OpenAI client wrapper
│       │   └── schema.ts          # Zod schemas
│       ├── layout.tsx
│       └── page.tsx
├── public/
└── package.json
```

## Features in Detail

### Epic Generator
Creates comprehensive epic documents including:
- Title and Background
- User Stories (in "As a..., I want..., so that..." format)
- Goals and Design specifications
- Affected Entities (Organizations, Environments, Systems)
- Acceptance Criteria (using Gherkin format)
- Optional JSON output for programmatic use

### JPD Idea Generator
Generates structured JPD Idea documents with:
- Opportunity Statement
- Problem Context
- Impact Analysis
- Desired Outcomes
- Resource Placeholders

### Product Update Generator
Transforms multiple epics into release notes format:
- Feature name derived from epic
- "What we did" summary
- "Why is this important" business value explanation

## Mock Mode

The application can run in mock mode when `OPENAI_API_KEY` is not set. This is useful for:
- Development without API costs
- UI testing
- Demonstrations

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.