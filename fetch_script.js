import fs from 'fs';

async function main() {
  const res = await fetch('https://raw.githubusercontent.com/WeiningLi/billiegene/main/index.html');
  const text = await res.text();
  fs.writeFileSync('index_raw.html', text);
  console.log('Successfully wrote index_raw.html, length:', text.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
