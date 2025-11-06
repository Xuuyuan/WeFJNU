---
layout: home
---
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
onMounted(() => {
  const router = useRouter();
  router.go('/mathB/24-25-1-mathB-mid-paper.html');
});
</script>
<div style="text-align: center; padding: 2rem;">正在跳转...</div>
