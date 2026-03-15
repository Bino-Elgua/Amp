<script>
  export let data;

  const priorityStatusColors = {
    'in-progress': '#ff6666',
    'todo': '#666666',
    'completed': '#00ff00',
  };
</script>

<div class="space-y-8">
  <div>
    <h2 class="text-2xl font-bold text-red-500 mb-4">7-Year Inheritance Lock</h2>
    <div class="bg-gray-900 rounded p-4">
      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>Day {data.daysElapsed}</span>
        <span>{(data.percentComplete).toFixed(1)}%</span>
        <span>Day {data.daysTotal}</span>
      </div>
      <div class="w-full bg-gray-800 rounded overflow-hidden h-8">
        <div
          class="h-full bg-gradient-to-r from-red-700 to-orange-500 transition-all"
          style="width: {data.percentComplete}%"
        />
      </div>
      <p class="text-xs text-gray-500 mt-2">Current Phase: {data.nextMilestone.name}</p>
    </div>
  </div>

  <!-- 90-Day Phases -->
  <div>
    <h3 class="text-xl font-bold text-white mb-4">Seven 90-Day Phases</h3>
    <div class="space-y-3">
      {#each data.phases as phase, idx}
        <div class="bg-gray-950 rounded p-3 border-l-4" style="border-left-color: {phase.color}">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-white">{phase.name}</span>
            <span class="text-xs text-gray-400">{phase.days} days</span>
          </div>
          <div class="w-full bg-gray-800 rounded h-4 overflow-hidden">
            <div
              class="h-full transition-all"
              style="width: {Math.min(100, (data.daysElapsed / (idx * 90 + phase.days)) * 100)}%; background-color: {phase.color}"
            />
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Priority Countdown (10 Critical Items) -->
  <div>
    <h3 class="text-xl font-bold text-white mb-4">🔥 Priority Order (Next 30-60 Days)</h3>
    <div class="space-y-2 max-h-96 overflow-y-auto">
      {#each data.priorityItems as item}
        <div
          class="bg-gray-950 rounded p-3 flex items-center gap-3 border-l-4 hover:bg-gray-900 transition-colors"
          style="border-left-color: {priorityStatusColors[item.status]}"
        >
          <div class="flex-shrink-0 font-bold text-lg text-gray-600 w-8 text-center">
            {item.order}
          </div>
          <div class="flex-1">
            <p class="text-sm text-white">{item.title}</p>
            <p class="text-xs text-gray-500">
              {#if item.status === 'in-progress'}
                ⏳ In Progress
              {:else if item.status === 'completed'}
                ✅ Completed
              {:else}
                ⏹️ To Do
              {/if}
            </p>
          </div>
          <div
            class="text-xs font-bold px-2 py-1 rounded"
            style="background-color: {priorityStatusColors[item.status]}20; color: {priorityStatusColors[item.status]}"
          >
            {item.status}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Sabbath Calendar -->
  <div>
    <h3 class="text-xl font-bold text-white mb-4">📅 Sabbath Calendar</h3>
    <p class="text-sm text-gray-400 mb-3">Every Saturday (UTC): No transactions allowed</p>
    <div class="grid grid-cols-7 gap-2">
      {#each Array(35) as _, day}
        <div
          class="aspect-square rounded text-center flex items-center justify-center text-xs font-bold {day % 7 === 6
            ? 'bg-red-900 text-red-200'
            : 'bg-gray-900 text-gray-300'}"
        >
          {day + 1}
        </div>
      {/each}
    </div>
  </div>
</div>
