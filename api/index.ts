import "dotenv/config";
import express from 'express';
import path from 'path';
import { generateEpic } from '../src/epic-generator.js';
import { generateProductUpdate } from '../src/product-updates-generator.js';
import { generateJpdIdea } from '../src/jpd-idea-generator.js';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.json());
// Serve static files from the `public` directory, which is now at the root
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/api/generate-epic', async (req, res) => {
    const { idea, organizations, environments } = req.body;

    if (!idea) {
        return res.status(400).json({ error: 'Idea is required' });
    }

    try {
        // Always request JSON to get structured data for formatting
        const result = await generateEpic({ 
            idea, 
            overview: idea, // Using idea as overview for simplicity
            organizations, 
            environments, 
            json: true 
        });
        
        if (typeof result === 'string') {
            // Handle cases where JSON generation failed and only text is returned
            res.json({ epic: { text: result } });
        } else {
            res.json({ epic: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate epic' });
    }
});

app.post('/api/generate-product-update', async (req, res) => {
    const { epics } = req.body;

    if (!epics || !Array.isArray(epics) || epics.length === 0) {
        return res.status(400).json({ error: 'At least one epic description is required' });
    }

    try {
        const result = await generateProductUpdate(epics);
        res.json({ productUpdate: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate product update' });
    }
});

app.post('/api/generate-jpd-idea', async (req, res) => {
    const { idea } = req.body;

    if (!idea) {
        return res.status(400).json({ error: 'An idea is required' });
    }

    try {
        const result = await generateJpdIdea(idea);
        res.json({ jpdIdea: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate JPD Idea' });
    }
});

// For local development, the server needs to listen on a port.
// Vercel will handle this automatically in production.
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
