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

    if (pdfContainer.value) {
      pdfContainer.value.innerHTML = ''
    }

    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
    pdfjsLib.GlobalWorkerOptions.workerSrc = withBase('/assets/pdfjs/pdf.worker.min.mjs')

    const pdf = await pdfjsLib.getDocument({
      url: withBase(props.src),
      cMapUrl: withBase('/assets/pdfjs/cmaps/'),
      cMapPacked: true,
      standardFontDataUrl: withBase('/assets/pdfjs/standard_fonts/')
    }).promise
    const numPages = pdf.numPages

    const containerWidth = pdfContainer.value?.clientWidth
      ? Math.min(pdfContainer.value.clientWidth - 20, 960)
      : 860
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3)

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const unscaledViewport = page.getViewport({ scale: 1 })
      const cssScale = Math.max(containerWidth / unscaledViewport.width, 1.2)
      const viewport = page.getViewport({ scale: cssScale })
      const outputScale = dpr

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = `${Math.floor(viewport.width)}px`
      canvas.style.height = 'auto'
      canvas.style.maxWidth = '100%'
      canvas.style.margin = '10px 0'
      canvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'
      canvas.style.borderRadius = '4px'

      pdfContainer.value.appendChild(canvas)

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null

      const renderContext = {
        canvasContext: context,
        transform,
        viewport
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
