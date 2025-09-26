import "dotenv/config";
import express from 'express';
import path from 'path';
import { generateEpic } from './epic-generator.js';
import { generateProductUpdate } from './product-updates-generator.js';
import { generateJpdIdea } from './jpd-idea-generator.js';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/generate-epic', async (req, res) => {
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

app.post('/generate-product-update', async (req, res) => {
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

app.post('/generate-jpd-idea', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
