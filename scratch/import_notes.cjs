const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const BASE_API = 'http://localhost:8080/api';
const notesDir = 'c:/Users/Pratibha Awasthi/Doc_Flow_AI/src/Notes';

async function createFolder(name) {
    const res = await fetch(`${BASE_API}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            label: name,
            icon: "folder",
            userEmail: "admin@docflow.ai",
            accentVar: "blue",
            bg: "#dbeafe",
            iconBg: "#eff6ff",
            iconColor: "#1d4ed8",
            badgeBg: "rgba(37,99,235,.1)",
            badgeColor: "#1d4ed8"
        })
    });
    return await res.json();
}

async function createNote(note) {
    const res = await fetch(`${BASE_API}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
    });
    return await res.json();
}

async function main() {
    const files = fs.readdirSync(notesDir).filter(f => f.toLowerCase().endsWith('.pdf'));
    for (const file of files) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(notesDir, file);
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        
        let text = data.text;
        // Clean up the text by replacing multiple newlines and spaces
        text = text.replace(/[\r\n]+/g, '\n').replace(/\s{2,}/g, ' ');
        // Limit to 15000 characters
        if (text.length > 15000) text = text.substring(0, 15000);
        
        const folderName = file.replace(/\.pdf$/i, '').replace(/_/g, ' ');
        const folder = await createFolder(folderName);
        
        await createNote({
            label: folderName,
            icon: "article",
            meta: `Imported PDF • Module: ${folderName}`,
            tag: "Imported",
            tagBg: "#d1fae5",
            tagColor: "#059669",
            content: text,
            summary: ["Document imported from PDF automatically.", `Title: ${folderName}`, "You can ask the AI about this note's content."],
            folderId: folder.id,
            userEmail: "admin@docflow.ai"
        });
        console.log(`Added ${file} to folder ${folder.id}`);
    }
}

main().catch(console.error);
