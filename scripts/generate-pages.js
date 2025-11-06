import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- 配置路径 ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const dataPath = path.join(__dirname, 'data.json');
const templatePath = path.join(__dirname, 'template.md');
// -----------------

// 读取数据和模板
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

console.log('开始根据新结构生成页面...');

for (const folder in data) {
  const course = data[folder];
  // 清理文件夹并重新创建
  const outputDir = path.join(rootDir, 'docs', folder);
  console.log(`[Clean] 正在清理: ${folder}/`);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  // 生成页面
  for (const group of course.groups) {
    for (const item of group.items) {
      
      let content = template
        .replace(new RegExp('{{TITLE}}', 'g'), item.title)
        .replace(new RegExp('{{COURSE_TITLE}}', 'g'), course.title)
        .replace(new RegExp('{{GROUP_TEXT}}', 'g'), group.text)
        .replace(new RegExp('{{PDF_LINK}}', 'g'), item.pdfLink);

      const outputPath = path.join(outputDir, item.id + '.md');

      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`  > 成功生成: ${folder}/${item.id}.md`);
    }
  }
}

console.log('全部页面生成完毕！');