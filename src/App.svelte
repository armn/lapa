<script lang="ts">
  import WritingArea from './lib/WritingArea.svelte'
</script>

<main>
  <h1 class="title">lapa.page</h1>
  <p class="subtitle">🕹️ Gamify your freewriting 📝</p>
  <WritingArea />
</main>

<style>
  main {
    padding: 1rem;
    margin: 0 auto;
  }

  h1 {
    color: #3b82f6;
    margin: 0;
    font-weight: 600;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
  }

  .subtitle {
    color: #64748b;
    font-size: 0.8rem;
    margin: 0;
  }
</style>