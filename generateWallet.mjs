import { ethers } from 'ethers';
import { appendFile } from 'fs/promises'; // 👈 用于异步追加文件内容

async function findVanityAddress(prefix = '', suffix = '', targetCount = Infinity) {
    let count = 0;
    let foundCount = 0;
    console.log(`🚀 开始寻找靓号地址：0x${prefix ? prefix : ''}...${suffix ? suffix : ''}`);
    console.log(`💡 程序将持续运行直到按 Ctrl+C 停止。已找到地址将追加保存到 vanitywallet.txt`);

    while (true) {
        const wallet = ethers.Wallet.createRandom();
        count++;

        if (
            (prefix === '' || wallet.address.startsWith(`0x${prefix}`)) &&
            (suffix === '' || wallet.address.endsWith(suffix))
        ) {
            foundCount++;
            // 🎯 构造要保存的完整信息
            const resultText = `
---
🎉 第 ${foundCount} 个目标地址！总尝试了 ${count} 次
钱包地址: ${wallet.address}
私钥: ${wallet.privateKey}
助记词: ${wallet.mnemonic.phrase}
---
`.trim();

            // 💾 追加到本地文件
            await appendFile('vanitywallet.txt', resultText + '\n', 'utf8');
            console.log(`\n🎉 找到第 ${foundCount} 个目标地址！${wallet.address}`);
            console.log(`✅ 详细信息已追加到 vanitywallet.txt`);
        }

        // 每 1000 次刷新进度
        if (count % 1000 === 0) {
            process.stdout.write(`\r已尝试 ${count} 次，已找到 ${foundCount} 个... (按 Ctrl+C 可停止)`);
        }

        await new Promise(resolve => setImmediate(resolve));
    }
}

// 使用 Node.js 的内置 readline 模块（通过 import）
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

(async () => {
    const prefixInput = await rl.question('请输入前几位（如 888888，留空默认无限制）：');
    const suffixInput = await rl.question('请输入后几位（如 88888，留空默认无限制）：');
    const countInput = await rl.question('请输入目标地址数量（留空为无限）：');
    const prefix = prefixInput.trim() || '';
    const suffix = suffixInput.trim() || '';
    const targetCount = countInput.trim() ? parseInt(countInput) : Infinity;
    rl.close();
    await findVanityAddress(prefix, suffix, targetCount);
})();