document.addEventListener('DOMContentLoaded', () => {
    // Generator Selection
    const selectEpicGeneratorBtn = document.getElementById('select-epic-generator');
    const selectProductUpdatesGeneratorBtn = document.getElementById('select-product-updates-generator');
    const selectJpdIdeaGeneratorBtn = document.getElementById('select-jpd-idea-generator');
    const epicGeneratorForm = document.getElementById('epic-generator-form');
    const productUpdatesForm = document.getElementById('product-updates-form');
    const jpdIdeaForm = document.getElementById('jpd-idea-form');

    // Epic Generator Elements
    const generateEpicBtn = document.getElementById('generate-epic');
    const ideaTextarea = document.getElementById('idea');
    const organizationsInput = document.getElementById('organizations');
    const environmentsInput = document.getElementById('environments');

    // Product Updates Generator Elements
    const generateProductUpdateBtn = document.getElementById('generate-product-update');
    const addEpicBtn = document.getElementById('add-epic-btn');
    const epicsContainer = document.getElementById('epics-container');
    
    // JPD Idea Generator Elements
    const generateJpdIdeaBtn = document.getElementById('generate-jpd-idea');
    const jpdIdeaInput = document.getElementById('jpd-idea-input');

    // Common Elements
    const outputDiv = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');

    let activeGenerator = null;

    // --- Event Listeners for Generator Selection ---
    selectEpicGeneratorBtn.addEventListener('click', () => {
        epicGeneratorForm.style.display = 'block';
        productUpdatesForm.style.display = 'none';
        jpdIdeaForm.style.display = 'none';
        activeGenerator = 'epic';
    });

    selectProductUpdatesGeneratorBtn.addEventListener('click', () => {
        epicGeneratorForm.style.display = 'none';
        productUpdatesForm.style.display = 'block';
        jpdIdeaForm.style.display = 'none';
        activeGenerator = 'product-update';
    });

    selectJpdIdeaGeneratorBtn.addEventListener('click', () => {
        epicGeneratorForm.style.display = 'none';
        productUpdatesForm.style.display = 'none';
        jpdIdeaForm.style.display = 'block';
        activeGenerator = 'jpd-idea';
    });
    
    // --- Epic Generator Logic ---
    generateEpicBtn.addEventListener('click', async () => {
        const idea = ideaTextarea.value;
        const organizations = organizationsInput.value.split(',').map(s => s.trim()).filter(Boolean);
        const environments = environmentsInput.value.split(',').map(s => s.trim()).filter(Boolean);

        if (!idea) {
            outputDiv.textContent = 'Please enter an idea for the epic.';
            return;
        }
        
        await generate('/api/generate-epic', { idea, organizations, environments }, 'epic');
    });

    // --- Product Updates Generator Logic ---
    addEpicBtn.addEventListener('click', () => {
        const epicCount = epicsContainer.getElementsByClassName('epic-input').length + 1;
        const newEpicGroup = document.createElement('div');
        newEpicGroup.className = 'epic-input-group';
        newEpicGroup.innerHTML = `<textarea class="epic-input" placeholder="Paste Epic ${epicCount} description here..."></textarea>`;
        epicsContainer.appendChild(newEpicGroup);
    });

    generateProductUpdateBtn.addEventListener('click', async () => {
        const epicInputs = Array.from(epicsContainer.getElementsByClassName('epic-input'));
        const epics = epicInputs.map(input => input.value.trim()).filter(Boolean);

        if (epics.length === 0) {
            outputDiv.textContent = 'Please enter at least one epic description.';
            return;
        }

        await generate('/api/generate-product-update', { epics }, 'productUpdate');
    });

    // --- JPD Idea Generator Logic ---
    generateJpdIdeaBtn.addEventListener('click', async () => {
        const idea = jpdIdeaInput.value;
        if (!idea) {
            outputDiv.textContent = 'Please enter an idea for the JPD.';
            return;
        }
        await generate('/api/generate-jpd-idea', { idea }, 'jpdIdea');
    });

    // --- Common Generation & Display Logic ---
    async function generate(endpoint, body, responseKey) {
        outputDiv.textContent = 'Generating...';
        copyBtn.style.display = 'none';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Something went wrong');
            }

            const data = await response.json();
            const resultData = data[responseKey];
            
            let formattedText = '';
            if (responseKey === 'epic' && resultData && resultData.json) {
                formattedText = getEpicFormattedText(resultData.json);
            } else if (responseKey === 'epic' && resultData && resultData.text) {
                formattedText = resultData.text;
            } else {
                formattedText = resultData;
            }

            outputDiv.textContent = formattedText;
            if (formattedText) {
                copyBtn.style.display = 'block';
            }
        } catch (error) {
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
    
    // --- Copy Button Logic ---
    copyBtn.addEventListener('click', () => {
        if (outputDiv.textContent) {
            navigator.clipboard.writeText(outputDiv.textContent).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
            });
        }
    });

    // --- Helper for Epic Formatting ---
    function getEpicFormattedText(json) {
        let text = '';
        const { title, background, user_stories, goals, design, affected_entities, acceptance_criteria, appendix } = json;
        if (title) text += `${title}\n\n`;
        if (background) text += `Background\n\n${background}\n\n`;
        if (user_stories && user_stories.length > 0) {
            text += `User Stories\n\n`;
            user_stories.forEach(story => {
                text += `* As a ${story.as_a}, I want ${story.i_want} so that ${story.so_that}\n`;
            });
            text += `\n`;
        }
        if (goals && goals.length > 0) {
            text += `Goals\n\n`;
            goals.forEach(goal => text += `* ${goal}\n`);
            text += `\n`;
        }
        if (design) {
            if (design.summary) text += `Design\n\n${design.summary}\n`;
            if (design.figma_links && design.figma_links.length > 0) {
                if (design.summary) text += `\n`;
                text += `Figma:\n`;
                design.figma_links.forEach(link => text += `* ${link}\n`);
            }
            text += `\n`;
        }
        if (affected_entities) {
            if (affected_entities.organizations && affected_entities.organizations.length > 0) {
                text += `Affected Organizations:\n`;
                affected_entities.organizations.forEach(item => {
                    const capitalized = item.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    text += `* ${capitalized}\n`;
                });
                text += `\n`;
            }
            if (affected_entities.environments && affected_entities.environments.length > 0) {
                text += `Affected Environments:\n`;
                affected_entities.environments.forEach(item => {
                    const capitalized = item.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    text += `* ${capitalized}\n`;
                });
                text += `\n`;
            }
        }
        if (acceptance_criteria && acceptance_criteria.length > 0) {
            text += `Acceptance Criteria\n\n`;
            acceptance_criteria.forEach(ac => text += `* ${ac}\n`);
            text += '\n';
        }
        if (appendix && appendix.useful_links && appendix.useful_links.length > 0) {
            text += `Appendix\n\n`;
            appendix.useful_links.forEach(link => text += `* ${link}\n`);
            text += `\n`;
        }
        return text;
    }
});
