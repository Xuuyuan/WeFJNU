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
import * as pdfjsLib from 'pdfjs-dist'

// ⬇️ 1. 从你安装的包中导入 worker，`?url` 是 Vite 的魔法
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// ⬇️ 2. 将 workerSrc 设置为 Vite 自动生成的 URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
// 定义组件 props，接收来自 Markdown 的 'src'
const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const pdfError = ref(null)
const pdfContainer = ref(null) // 引用模板中的 div

onMounted(() => {
  loadPdf()
})

async function loadPdf() {
  try {
    loading.value = true
    pdfError.value = null

    const pdf = await pdfjsLib.getDocument(props.src).promise
    const numPages = pdf.numPages

    // 循环渲染所有页面
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      
      // 设置缩放
      const viewport = page.getViewport({ scale: 1.5 }) 

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.margin = '10px 0' // 页面间距
      canvas.style.maxWidth = '100%' // 响应式
      canvas.style.height = 'auto'

      // 将 canvas 添加到容器中
      pdfContainer.value.appendChild(canvas)

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      await page.render(renderContext).promise
    }
    
    loading.value = false
  } catch (error) {
    console.error('PDF.js 加载失败:', error)
    pdfError.value = error.message
    loading.value = false
  }
}
</script>

<style scoped>
.pdf-preview-container {
  overflow: hidden; /* 确保子元素不会溢出圆角 */
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
  padding: 10px; /* 内部留白 */
  /* 确保 canvas 可以在内部居中（如果它没有占满100%）*/
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>