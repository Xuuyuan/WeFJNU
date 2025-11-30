---
layout: home
---
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
onMounted(() => {
  const router = useRouter();
  router.go('/linear-algebra/25-26-1-linear-algebra-mid-paper.html');
});
</script>
<div style="text-align: center; padding: 2rem;">正在跳转...</div>
