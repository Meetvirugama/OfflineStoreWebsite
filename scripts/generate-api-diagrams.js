const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '../server/src');
const docsDir = path.join(__dirname, '../docs/API_VISUALIZATION');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const routeFiles = fs.readdirSync(path.join(srcDir, 'routes')).filter(f => f.endsWith('Routes.js'));

let finalMmd = `graph TD\n    subgraph ERP_SYSTEM_ARCHITECTURE\n`;

for (const routeFile of routeFiles) {
    const moduleName = routeFile.replace('Routes.js', '');
    const moduleUpper = moduleName.toUpperCase();
    
    let mmd = `graph TD\n`;
    mmd += `    subgraph ${moduleUpper}_MODULE\n`;
    
    const routeContent = fs.readFileSync(path.join(srcDir, 'routes', routeFile), 'utf-8');
    
    const routeRegex = /router\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    let index = 0;
    
    mmd += `        Controller["${moduleName}Controller.js"]:::controller\n`;
    
    // Check if there is a service
    const hasService = fs.existsSync(path.join(srcDir, 'services', `${moduleName}Service.js`));
    if (hasService) {
        mmd += `        Service["${moduleName}Service.js"]:::service\n`;
        mmd += `        Controller --> Service\n`;
        // Check if there's a db hit or external utils, assume Service hits DB
        mmd += `        Service --> DB[(Database)]:::db\n`;
    } else {
        mmd += `        Controller --> DB[(Database)]:::db\n`;
    }
    
    const endpoints = [];
    while ((match = routeRegex.exec(routeContent)) !== null) {
        const method = match[1].toUpperCase();
        const endpoint = match[2];
        const routeNodeId = `R_${index}`;
        mmd += `        ${routeNodeId}["${method} ${endpoint}"]:::route --> Controller\n`;
        endpoints.push(`${method} ${endpoint}`);
        index++;
    }
    
    mmd += `    end\n`;
    
    mmd += `    classDef route fill:#2E8B57,color:white,stroke:#155d31,stroke-width:2px,rx:10;\n`;
    mmd += `    classDef controller fill:#4682B4,color:white,stroke:#1a4d77,stroke-width:2px,rx:5;\n`;
    mmd += `    classDef service fill:#D2691E,color:white,stroke:#8a400c,stroke-width:2px,rx:5;\n`;
    mmd += `    classDef db fill:#4b0082,color:white,stroke:#36005c,stroke-width:2px;\n`;
    
    const mmdPath = path.join(docsDir, `${moduleUpper}.mmd`);
    const pngPath = path.join(docsDir, `${moduleUpper}.png`);
    
    if (index > 0) {
        fs.writeFileSync(mmdPath, mmd);
        console.log(`Generating PNG for ${moduleUpper}... (${endpoints.length} endpoints)`);
        finalMmd += `        ${moduleUpper}_MODULE["${moduleUpper} API (${endpoints.length} Endpoints)"]:::moduleNode --> ${moduleUpper}_DB[(DB)]\n`;
        
        try {
            execSync(`npx -y @mermaid-js/mermaid-cli@11 -p ${path.join(__dirname, 'puppeteer-config.json')} -i "${mmdPath}" -o "${pngPath}" -b transparent --scale 2`);
            fs.unlinkSync(mmdPath);
        } catch (err) {
            console.error(`Failed on ${moduleUpper}:`, err.message);
        }
    }
}

finalMmd += `    end\n`;
finalMmd += `    classDef moduleNode fill:#003366,color:white,stroke:#002244,stroke-width:2px,rx:5;\n`;

const finalMmdPath = path.join(docsDir, `FINAL_API.mmd`);
const finalPngPath = path.join(docsDir, `FINAL_API.png`);
fs.writeFileSync(finalMmdPath, finalMmd);
console.log(`Generating FINAL_API PNG...`);
try {
    execSync(`npx -y @mermaid-js/mermaid-cli@11 -p ${path.join(__dirname, 'puppeteer-config.json')} -i "${finalMmdPath}" -o "${finalPngPath}" -b transparent --scale 2`);
    fs.unlinkSync(finalMmdPath);
} catch (err) {
    console.error(`Failed on FINAL_API:`, err.message);
}

console.log('✅ Visualization refresh complete!');
