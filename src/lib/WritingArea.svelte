<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { WritingStats, SavedText } from './types';
  import { achievements } from './achievements';
  
  let text = '';
  let elapsedTime = 0;
  let isWriting = false;
  let timer: number;
  let stats: WritingStats = {
    currentWordCount: 0,
    totalWordCount: 0,
    streak: 0,
    lastWriteDate: null,
    deletions: 0,
    sessionsCompleted: 0,
    totalTimeSpent: 0
  };
  
  let achievementsList = achievements;
  let showAchievement = false;
  let lastUnlockedAchievement = '';
  let wordsLastMinute = 0;
  let lastWordCount = 0;
  let lastSaveTime = Date.now();
  let saveInterval: number;
  let longWords = new Set<string>();
  let savedTexts: SavedText[] = [];
  let selectedText: SavedText | null = null;
  let editingTitle: string | null = null;
  let writingDays = new Set<string>();

  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function checkLongWords(text: string) {
    const words = text.trim().split(/\s+/);
    words.forEach(word => {
      if (word.length > 8) {
        longWords.add(word.toLowerCase());
      }
    });
    return longWords.size;
  }

  function startWriting() {
    isWriting = true;
    wordsLastMinute = 0;
    lastWordCount = countWords(text);
    //elapsedTime = 0;
    
    timer = setInterval(() => {
      elapsedTime++;
      stats.totalTimeSpent++;
      checkAchievements();
    }, 1000);
  }

  function completeSession() {
    isWriting = false;
    clearInterval(timer);
    stats.sessionsCompleted++;
    stats.totalWordCount += countWords(text);
    updateStreak();
    checkAchievements();
    saveProgress();
    saveCurrentText();
    elapsedTime = 0; // Reset time counter
  }

  function loadText(saved: SavedText) {
    selectedText = saved;
    text = saved.content;
    stats.currentWordCount = saved.wordCount;
    elapsedTime = saved.timeSpent;
    if (!isWriting) {
      startWriting();
    }
  }

  function saveCurrentText() {
    const wordCount = countWords(text);
    if (wordCount === 0) return;

    if (selectedText) {
      savedTexts = savedTexts.map(t => 
        t.id === selectedText.id 
          ? { 
              ...t, 
              content: text,
              wordCount,
              updatedAt: new Date(),
              timeSpent: elapsedTime
            } 
          : t
      );
    } else {
      const newText: SavedText = {
        id: crypto.randomUUID(),
        title: `Writing ${savedTexts.length + 1}`,
        content: text,
        wordCount,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeSpent: elapsedTime
      };
      savedTexts = [newText, ...savedTexts];
    }
    
    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
    text = '';
    stats.currentWordCount = 0;
    selectedText = null;
  }

  function deleteText(id: string) {
    savedTexts = savedTexts.filter(t => t.id !== id);
    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
    if (selectedText?.id === id) {
      selectedText = null;
      text = '';
      stats.currentWordCount = 0;
    }
  }

  function startEditingTitle(text: SavedText) {
    editingTitle = text.id;
  }

  function saveTitle(text: SavedText, event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();
    if (newTitle) {
      savedTexts = savedTexts.map(t => 
        t.id === text.id ? { ...t, title: newTitle } : t
      );
      localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
    }
    editingTitle = null;
  }

  function updateStreak() {
    stats.streak = stats.sessionsCompleted;
    const today = new Date().toLocaleDateString();
    writingDays.add(today);
  }

  function checkAchievements() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isNightTime = hour >= 0 && hour < 5;
    const isEarlyMorning = hour >= 5 && hour < 7;
    const isWeekend = day === 0 || day === 6;

    achievementsList = achievementsList.map(achievement => {
      let progress = 0;
      switch (achievement.id) {
        case 'first-words':
          progress = stats.totalWordCount;
          break;
        case 'word-warrior':
          progress = stats.totalWordCount;
          break;
        case 'streak-master':
          progress = stats.sessionsCompleted;
          break;
        case 'delete-demon':
          progress = stats.deletions;
          break;
        case 'speed-demon':
          progress = wordsLastMinute;
          break;
        case 'marathon-writer':
          progress = stats.sessionsCompleted;
          break;
        case 'night-owl':
          progress = isNightTime && isWriting ? 1 : 0;
          break;
        case 'wordsmith':
          progress = checkLongWords(text);
          break;
        case 'time-traveler':
          progress = stats.totalTimeSpent;
          break;
        case 'persistent-poet':
          progress = elapsedTime;
          break;
        case 'prolific-writer':
          progress = savedTexts.length;
          break;
        case 'early-bird':
          progress = isEarlyMorning && isWriting ? 1 : 0;
          break;
        case 'weekend-warrior':
          progress = isWeekend && isWriting ? writingDays.size : 0;
          break;
        case 'dedication':
          progress = writingDays.size;
          break;
        case 'novel-starter':
          progress = stats.totalWordCount;
          break;
      }

      if (progress >= achievement.target && !achievement.unlocked) {
        achievement.unlocked = true;
        showAchievement = true;
        lastUnlockedAchievement = achievement.name;
        setTimeout(() => {
          showAchievement = false;
        }, 3000);
      }

      return {
        ...achievement,
        progress: Math.min(progress, achievement.target)
      };
    });
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const newText = target.value;
    if (newText.length < text.length) {
      stats.deletions += text.length - newText.length;
    }
    text = newText;
    stats.currentWordCount = countWords(text);5
    checkAchievements();
  }

  function saveProgress() {
    localStorage.setItem('writingStats', JSON.stringify(stats));
    localStorage.setItem('achievements', JSON.stringify(achievementsList));
    localStorage.setItem('writingDays', JSON.stringify(Array.from(writingDays)));
  }

  function clearAllData() {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      localStorage.clear();
      savedTexts = [];
      stats = {
        currentWordCount: 0,
        totalWordCount: 0,
        streak: 0,
        lastWriteDate: null,
        deletions: 0,
        sessionsCompleted: 0,
        totalTimeSpent: 0
      };
      achievementsList = achievementsList.map(a => ({ ...a, unlocked: false, progress: 0 }));
      writingDays = new Set();
      text = '';
      selectedText = null;
    }
  }

  onMount(() => {
    const savedStats = localStorage.getItem('writingStats');
    const savedAchievements = localStorage.getItem('achievements');
    const savedTextsList = localStorage.getItem('savedTexts');
    const savedDays = localStorage.getItem('writingDays');
    
    if (savedStats) {
      stats = JSON.parse(savedStats);
    }
    if (savedAchievements) {
      achievementsList = JSON.parse(savedAchievements);
    }
    if (savedTextsList) {
      savedTexts = JSON.parse(savedTextsList);
    }
    if (savedDays) {
      writingDays = new Set(JSON.parse(savedDays));
    }
  });

  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
    if (saveInterval) {
      clearInterval(saveInterval);
    }
  });

  $: unlockedAchievements = achievementsList.filter(a => a.unlocked).length;
</script>

<div class="app-container">
  {#if showAchievement}
    <div class="achievement-popup">
      <div class="achievement-content">
        🎉 Achievement Unlocked: {lastUnlockedAchievement}!
      </div>
    </div>
  {/if}

  <aside class="saved-texts">
    <h2>Saved Writings <span class="counter">({savedTexts.length})</span></h2>
    <div class="stats-overview">
      <div class="mini-stat">Total Words: {stats.totalWordCount}</div>
      <div class="mini-stat">Sessions: {stats.sessionsCompleted}</div>
    </div>
    <div class="texts-list custom-scrollbar">
      {#each savedTexts as saved}
        <div class="saved-text" class:selected={selectedText?.id === saved.id}>
          <div class="text-info" on:click={() => loadText(saved)}>
            {#if editingTitle === saved.id}
              <input
                type="text"
                value={saved.title}
                on:blur={(e) => saveTitle(saved, e)}
                on:keydown={(e) => e.key === 'Enter' && saveTitle(saved, e)}
                class="title-input"
              />
            {:else}
              <h3 on:dblclick={() => startEditingTitle(saved)}>{saved.title}</h3>
            {/if}
            <p>
              {saved.wordCount} words • {formatTime(saved.timeSpent)} • 
              {new Date(saved.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <button class="delete-btn" on:click={() => deleteText(saved.id)}>×</button>
        </div>
      {/each}
    </div>
  </aside>

  <main class="writing-section">
    <div class="writing-area">
      {#if !isWriting}
        <button class="primary start-btn" on:click={startWriting}>Start Writing</button>
      {:else}
        <textarea
          bind:value={text}
          on:input={handleInput}
          disabled={!isWriting}
        ></textarea>
        <div class="writing-controls">
        
        <div class="writing-stats">
          <div class="stat">Time: {formatTime(elapsedTime)}</div>
          <div class="stat">Words: {stats.currentWordCount}</div>
        </div>
        
        <div class="button-group">
          <button class="primary" on:click={completeSession}>Complete session</button>
        </div>

      </div>
      {/if}
    </div>
  </main>

  <aside class="achievements-panel">
    <h2>
      Achievements 
      <span class="counter">({unlockedAchievements}/{achievementsList.length})</span>
    </h2>
    <div class="unlocked-achievements">
      {#each achievementsList.filter(a => a.unlocked) as achievement}
        <div class="unlocked-icon" data-tooltip={`${achievement.name}: ${achievement.description}`}>
          {achievement.icon}
        </div>
      {/each}
    </div>
    <div class="achievements-list custom-scrollbar">
      {#each achievementsList.filter(a => !a.unlocked) as achievement}
        <div 
          class="achievement" 
          data-description={achievement.hint}
        >
          <div class="achievement-header">
            <span class="icon">{achievement.icon}</span>
            <div class="achievement-title">
              <h4>{achievement.name}</h4>
              <p class="hint">{achievement.description}</p>
              <div class="progress-bar">
                <div 
                  class="progress" 
                  style="width: {(achievement.progress / achievement.target) * 100}%"
                ></div>
              </div>
            </div>
            <span class="progress-text">{achievement.progress}/{achievement.target}</span>
          </div>
        </div>
      {/each}
    </div>
  </aside>

  <footer class="app-footer">
    <p class="footer-text">Made by <a href="https://ko-fi.com/armands">Armands</a>, source code available on <a href="https://github.com/armn/lapa">Github</a>.</p>
    <button class="danger" on:click={clearAllData}>Clear all saved data</button>
  </footer>
</div>

<style>
  .app-container {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-template-rows: 1fr auto;
    gap: 2rem;
    height: 100vh;
    max-width: 100vw;
    margin: 0 auto;
    padding: 1rem 0;
  }

  aside {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: calc(100vh - 10rem);
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .counter {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: normal;
  }

  .saved-texts {
    border-right: 1px solid #e2e8f0;
  }

  .saved-text {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .saved-text:hover {
    background: #f1f5f9;
  }

  .saved-text.selected {
    background: #e0f2fe;
  }

  .text-info {
    flex: 1;
  }

  .text-info h3 {
    font-size: 0.9rem;
    margin: 0;
    color: #334155;
  }

  .text-info p {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0.2rem 0 0 0;
  }

  .title-input {
    font-size: 0.9rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    width: 90%;
  }

  .title-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .delete-btn {
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    color: #94a3b8;
    background: none;
    border: none;
  }

  .delete-btn:hover {
    color: #ef4444;
    background: none;
  }

  .writing-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .writing-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  textarea {
    flex: 1;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    resize: none;
    font-size: 1rem;
    line-height: 1.6;
    background: white;
    color: #334155;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .start-btn {
    align-self: center;
    font-size: 1.1rem;
    padding: 0.8em 2em;
  }

  .writing-stats {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 6px;
  }

  .stat {
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #64748b;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .stats-overview {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .mini-stat {
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    background: #f8fafc;
    border-radius: 4px;
  }

  .unlocked-achievements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 6px;
  }

  .unlocked-icon {
    font-size: 1.2rem;
    padding: 0.5rem;
    background: #f0fdf4;
    border-radius: 6px;
    cursor: help;
    position: relative;
  }

  .unlocked-icon[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%) translateY(8px);
    background: #1e293b;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    z-index: 1000;
    pointer-events: none;
    width: max-content;
    max-width: 250px;
    text-align: center;
  }

  .achievements-list {
    flex: 1;
    overflow-y: auto;
    margin-top: 0.5rem;
  }

  .achievement {
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    background: #f8fafc;
    transition: all 0.2s;
    position: relative;
  }

  .achievement:hover::after {
    content: attr(data-description);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: #1e293b;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: normal;
    width: max-content;
    max-width: 250px;
    z-index: 1000;
    pointer-events: none;
    text-align: center;
  }

  .achievement-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .icon {
    font-size: 1.2rem;
  }

  .achievement-title {
    flex: 1;
  }

  .achievement h4 {
    font-size: 0.9rem;
    margin: 0 0 0.2rem 0;
    color: #334155;
  }

  .hint {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0 0 0.4rem 0;
    line-height: 1.3;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.8rem;
    color: #64748b;
    min-width: 3rem;
    text-align: right;
  }

  .custom-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .texts-list {
    flex: 1;
    overflow-y: auto;
  }

  .achievement-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000;
  }

  .achievement-content {
    background: white;
    color: #059669;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
  }

  .app-footer {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }

  .footer-text {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }

  button.danger {
    background-color: #fee2e2;
    color: #ef4444;
    border: none;
  }

  button.danger:hover {
    background-color: #fecaca;
  }

  .achievements-panel {
    border-left: 1px solid #e2e8f0;
    z-index: 100;
    position: relative;
  }

  .writing-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) { 
    .app-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
    }
    .saved-texts {
      order: 1;
    }

    .achievements-panel {
      order: 2;
    }
    footer {
      order: 3;
    }

    .unlocked-icon[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    top: auto;
    left: 100%;
    right: 100%;
    bottom: 0;
    transform: translateX(-20%);
  }

  }
</style>