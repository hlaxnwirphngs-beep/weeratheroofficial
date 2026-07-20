const fs = require('fs');
const path = require('path');
const dir = 'src/pages/admin/';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Replace: const { (word), updateItem
  // Or: const { (word), addItem
  let newContent = content.replace(/const\s+\{\s*([a-zA-Z]+)\s*,\s*(updateItem|deleteItem|addItem|setItems)/g, 'const { $1 = [], $2');
  
  // Dashboard might be different, let's just do a specific replace for known ones:
  // If it didn't change, we try another pattern if it's a manager
  if (file.endsWith('Manager.tsx')) {
     if (content !== newContent) {
        fs.writeFileSync(path.join(dir, file), newContent);
     }
  }
});
