<template>
  <div class="pdf-preview-container">
    <div v-if="loading" class="pdf-loading">
      正在加载 PDF...
    </div>
    <div v-if="pdfError" class="pdf-error">
      PDF 加载失败：{{ pdfError }}
    </div>
    <div ref="pdfContainer" class="pdf-render-area"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 【关键】除了 inBrowser，我们还导入 withBase
import { inBrowser, withBase } from 'vitepress'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const pdfError = ref(null)
const pdfContainer = ref(null)

onMounted(async () => {
  if (inBrowser) {
    await loadPdf()
  }
})

async function loadPdf() {
  try {
    loading.value = true
    pdfError.value = null

    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
    
    // 【最终方案】
    // 我们不再 import worker 文件，而是直接构建它的 URL 字符串。
    // withBase 会处理好部署在子目录下的情况，确保路径永远正确。
    pdfjsLib.GlobalWorkerOptions.workerSrc = withBase('/assets/pdfjs/pdf.worker.min.mjs')

    const pdf = await pdfjsLib.getDocument(props.src).promise
    const numPages = pdf.numPages

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 1.5 })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.margin = '10px 0'
      canvas.style.maxWidth = '100%'
      canvas.style.height = 'auto'

      pdfContainer.value.appendChild(canvas)

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      await page.render(renderContext).promise
    }
  } catch (error) {
    console.error('PDF.js 加载失败:', error)
    pdfError.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 样式部分保持不变 */
.pdf-preview-container {
  overflow: hidden;
}
.pdf-loading, .pdf-error {
  padding: 40px;
  text-align: center;
  font-size: 1.2em;
  color: #666;
}
.pdf-error {
  color: #e53935;
}
.pdf-render-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>