---
layout: home
---
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
onMounted(() => {
  const router = useRouter();
  router.go('/mathD/25-26-1-mathD-mid-paper.html');
});
</script>
<div style="text-align: center; padding: 2rem;">正在跳转...</div>
