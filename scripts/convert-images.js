/**
 * 🖼️ Script de conversão de imagens PNG para WebP
 *
 * Por que WebP?
 * - 25-35% menor que PNG
 * - Mesma qualidade visual
 * - 97% de suporte nos browsers
 *
 * Uso: node scripts/convert-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  'public/assets/kanbandark.png',
  'public/assets/kanbanlight.png',
  'public/assets/notesdark.png',
  'public/assets/noteslight.png',
];

async function convertImages() {
  console.log('🖼️  Convertendo imagens para WebP...\n');

  for (const img of images) {
    const inputPath = path.join(process.cwd(), img);
    const outputPath = inputPath.replace('.png', '.webp');

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${img} não encontrado, pulando...`);
      continue;
    }

    try {
      const inputStats = fs.statSync(inputPath);
      const inputSize = (inputStats.size / 1024).toFixed(2);

      await sharp(inputPath)
        .webp({
          quality: 85,    // 85% de qualidade (imperceptível ao olho humano)
          effort: 6,      // Máximo esforço de compressão (mais lento, menor arquivo)
        })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputSize = (outputStats.size / 1024).toFixed(2);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

      console.log(`✅ ${img}`);
      console.log(`   PNG: ${inputSize} KB → WebP: ${outputSize} KB`);
      console.log(`   Economia: ${savings}% (-${(inputSize - outputSize).toFixed(2)} KB)\n`);
    } catch (error) {
      console.error(`❌ Erro ao converter ${img}:`, error.message);
    }
  }

  console.log('🎉 Conversão concluída!');
  console.log('\n📝 Próximo passo:');
  console.log('   Atualize os componentes para usar .webp em vez de .png');
  console.log('   Exemplo: src="/assets/kanbandark.webp"');
}

convertImages();
