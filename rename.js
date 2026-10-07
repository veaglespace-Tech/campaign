const fs = require('fs');
const path = require('path');

function casePreservingReplace(text) {
    const replacements = [
        { s: 'demands', r: 'demands' },
        { s: 'Demands', r: 'Demands' },
        { s: 'DEMANDS', r: 'DEMANDS' },
        { s: 'demand', r: 'demand' },
        { s: 'Demand', r: 'Demand' },
        { s: 'DEMAND', r: 'DEMAND' }
    ];
    let newText = text;
    for (const { s, r } of replacements) {
        newText = newText.split(s).join(r);
    }
    return newText;
}

function walkSync(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (['node_modules', '.git', '.next'].includes(file)) continue;
        
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walkSync(filepath, callback);
        }
        callback(filepath, stats);
    }
}

const rootDir = '.';

// 1. Update file contents
walkSync(rootDir, (filepath, stats) => {
    if (stats.isFile() && filepath.match(/\.(js|jsx|json|prisma|md|html|css|env)$/)) {
        try {
            const content = fs.readFileSync(filepath, 'utf8');
            const newContent = casePreservingReplace(content);
            if (content !== newContent) {
                fs.writeFileSync(filepath, newContent, 'utf8');
                console.log(`Updated ${filepath}`);
            }
        } catch (e) {
            console.error(`Failed to process ${filepath}:`, e);
        }
    }
});

// 2. Rename files
const dirsToRename = [];
const filesToRename = [];

walkSync(rootDir, (filepath, stats) => {
    if (stats.isFile() && path.basename(filepath).toLowerCase().includes('demand')) {
        filesToRename.push(filepath);
    } else if (stats.isDirectory() && path.basename(filepath).toLowerCase().includes('demand')) {
        dirsToRename.push(filepath);
    }
});

for (const filepath of filesToRename) {
    const dir = path.dirname(filepath);
    const oldName = path.basename(filepath);
    const newName = casePreservingReplace(oldName);
    const newPath = path.join(dir, newName);
    fs.renameSync(filepath, newPath);
    console.log(`Renamed ${filepath} to ${newPath}`);
}

// 3. Rename dirs (from deepest first so we don't invalidate paths)
dirsToRename.sort((a, b) => b.length - a.length);
for (const filepath of dirsToRename) {
    const dir = path.dirname(filepath);
    const oldName = path.basename(filepath);
    const newName = casePreservingReplace(oldName);
    const newPath = path.join(dir, newName);
    fs.renameSync(filepath, newPath);
    console.log(`Renamed dir ${filepath} to ${newPath}`);
}
