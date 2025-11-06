import { defineConfig, type DefaultTheme } from 'vitepress'
import data from '../../scripts/data.json' with { type: 'json' }

/**
 * 自动生成侧栏的辅助函数
 */
function buildSidebar() {
  const sidebar: DefaultTheme.SidebarMulti = {}

  const folders = Object.keys(data) as Array<keyof typeof data>

  for (const folder of folders) {
    const course = data[folder]
    const sidebarKey = `/${folder}/`

    const sidebarGroups = course.groups.map(group => {
      const items = group.items.map(item => {
        return {
          text: item.title,
          link: `/${folder}/${item.id}`
        }
      })
      
      return {
        text: group.text,
        collapsed: false,
        items: items
      }
    })

    sidebar[sidebarKey] = [
      {
        text: course.title,
        items: sidebarGroups
      }
    ]
  }
  return sidebar
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WeFJNU",
  description: "福师大公共课程资料分享。",
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
  ],
  locales: {
    "/": {
      label: "简体中文",
      lang: "zh-CN",
    },
  },
  cleanUrls: true,
  // 主题配置
  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '浅色模式&深色模式切换',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    notFound: {
      code: '404',
      title: '页面未找到',
      quote: '您访问的页面不存在',
      linkLabel: '返回首页',
      linkText: '点击这里返回主页'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '高数A', link: '/mathA/' },
      { text: '高数B', link: '/mathB/' },
      { text: '线性代数', link: '/linear-algebra/' },
      { text: '概率论', link: '/probability-theory/' },
      { text: '体育理论', link: '/sport/' },
      { text: '关于', link: '/about' }
    ],
    sidebar: buildSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Xuuyuan/WeFJNU' }
    ],
    footer: {
      message: '所分享资料版权归原作者所有，仅供学习交流',
      copyright: 'Copyright © 2025 by Xuuyuan'
    }
  },
  vite: { // 调试
    server: {
      host: '0.0.0.0'
    }
  }
})