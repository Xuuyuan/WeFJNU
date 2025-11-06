// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import PDFPreview from './components/PDFPreview.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    // 注册你的自定义组件
    app.component('PDFPreview', PDFPreview)
  }
}