import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';

export default function Snippets() {
  const [copiedId, setCopiedId] = useState(null);

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const snippets = [
    {
      id: 'bind-to-close',
      title: '1. Data Loss Prevention (BindToClose Lifecycle)',
      category: 'DataStore Stability',
      tagline: 'Safely flush player session state when Roblox shuts down servers for updates.',
      whyCrucial: 'Many standard tutorials only save player data inside PlayerRemoving. When Roblox servers shut down unexpectedly during game updates, the runtime cuts off PlayerRemoving threads before pending DataStore writes can complete. Players lose items and progression, resulting in negative player reviews.',
      code: `-- [ServerScriptService / PlayerDataManager.luau]
--!strict
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local RunService = game:GetService("RunService")

local PlayerDataStore = DataStoreService:GetDataStore("PlayerSave_v1")
local SessionData: { [number]: { Coins: number, Level: number } } = {}

local function SavePlayerData(player: Player): boolean
	local userId = player.UserId
	local data = SessionData[userId]
	if not data then return true end
	
	local success, err = pcall(function()
		PlayerDataStore:SetAsync("User_" .. userId, data)
	end)
	
	if not success then
		warn(string.format("[DataStore] Failed to save data for %s: %s", player.Name, tostring(err)))
		return false
	end
	
	SessionData[userId] = nil
	return true
end

-- Save on standard player departure
Players.PlayerRemoving:Connect(SavePlayerData)

-- CRITICAL: Hold server shutdown until all active players are written
game:BindToClose(function()
	if RunService:IsStudio() then return end
	
	print("[Server] Server shutting down, flushing player data...")
	local activePlayers = Players:GetPlayers()
	local pendingCount = #activePlayers
	
	for _, player in ipairs(activePlayers) do
		task.spawn(function()
			SavePlayerData(player)
			pendingCount -= 1
		end)
	end
	
	-- Wait up to 28 seconds (BindToClose hard timeout is 30 seconds)
	local startTime = os.clock()
	while pendingCount > 0 and (os.clock() - startTime) < 28 do
		task.wait(0.5)
	end
	print("[Server] All player data safely written to DataStore.")
end)`,
    },
    {
      id: 'remote-limiter',
      title: '2. Server-Side RemoteEvent Rate Limiter',
      category: 'Network & Security',
      tagline: 'Shield the server against client exploits and rapid network flooding.',
      whyCrucial: 'Exploiters can execute client-side scripts to invoke RemoteEvents thousands of times per second. Without strict server-side throttling, this floods task scheduler queues, spikes server memory, and degrades tick rates for every player in the session.',
      code: `-- [ServerScriptService / RemoteGuard.luau]
--!strict
local Players = game:GetService("Players")

local RemoteGuard = {}
local RequestLogs: { [number]: { [string]: { Count: number, LastReset: number } } } = {}

-- Rule: Maximum requests allowed per rolling second
local DEFAULT_MAX_REQUESTS = 10 -- maximum 10 requests
local WINDOW_SECONDS = 1.0       -- within a 1-second window

function RemoteGuard.Check(player: Player, remoteName: string, maxRequests: number?): boolean
	local userId = player.UserId
	local limit = maxRequests or DEFAULT_MAX_REQUESTS
	local now = os.clock()
	
	if not RequestLogs[userId] then
		RequestLogs[userId] = {}
	end
	
	local userLog = RequestLogs[userId]
	if not userLog[remoteName] then
		userLog[remoteName] = { Count = 1, LastReset = now }
		return true
	end
	
	local tracker = userLog[remoteName]
	if (now - tracker.LastReset) >= WINDOW_SECONDS then
		-- Reset interval window
		tracker.Count = 1
		tracker.LastReset = now
		return true
	end
	
	tracker.Count += 1
	if tracker.Count > limit then
		warn(string.format("[EXPLOIT ALERT] %s (%d) exceeded Remote threshold: %s (%d requests)", 
			player.Name, userId, remoteName, tracker.Count))
		return false -- REJECT REQUEST
	end
	
	return true
end

-- Clear cache when player leaves to prevent memory leaks
Players.PlayerRemoving:Connect(function(player)
	RequestLogs[player.UserId] = nil
end)

return RemoteGuard`,
    },
    {
      id: 'receipt-handler',
      title: '3. Idempotent Marketplace ProcessReceipt Handler',
      category: 'Monetisation Integrity',
      tagline: 'Ensure purchased developer products are neither lost nor duplicated.',
      whyCrucial: 'Handling ProcessReceipt incorrectly damages in-game trust and revenue. Returning PurchaseGranted before data is saved can result in lost player Robux on server disconnects. Returning NotProcessedYet repeatedly without idempotent receipts allows players to duplicate inventory items.',
      code: `-- [ServerScriptService / ReceiptProcessor.luau]
--!strict
local MarketplaceService = game:GetService("MarketplaceService")
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local PurchaseHistoryStore = DataStoreService:GetDataStore("PurchaseHistory_v1")

local PRODUCT_HANDLERS: { [number]: (player: Player) -> boolean } = {
	[12345678] = function(player) -- Replace with your Developer Product ID
		-- Award 1,000 Gems to player
		print(string.format("[Shop] Awarding 1,000 Gems to %s", player.Name))
		return true
	end,
}

MarketplaceService.ProcessReceipt = function(receiptInfo): Enum.ProductPurchaseDecision
	local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
	if not player then
		-- Player left during purchase; retry when they rejoin
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	
	local receiptKey = string.format("receipt_%s_%s", receiptInfo.PlayerId, receiptInfo.PurchaseId)
	
	-- Verify if transaction was already completed (Anti-Duplication)
	local alreadyProcessed = false
	pcall(function()
		alreadyProcessed = PurchaseHistoryStore:GetAsync(receiptKey) == true
	end)
	
	if alreadyProcessed then
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end
	
	-- Grant items through product registry
	local handler = PRODUCT_HANDLERS[receiptInfo.ProductId]
	if not handler then
		warn("[Marketplace] Missing handler for Product ID:", receiptInfo.ProductId)
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	
	local success, grantResult = pcall(handler, player)
	if success and grantResult == true then
		-- Persist receipt state in DataStore before confirming
		pcall(function()
			PurchaseHistoryStore:SetAsync(receiptKey, true)
		end)
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end
	
	return Enum.ProductPurchaseDecision.NotProcessedYet
end`,
    },
  ];

  return (
    <AppLayout
      title="Luau Code Vault & Architecture Patterns"
      description="Production-grade Luau code snippets for Roblox developers: anti-exploit networking, DataStore BindToClose lifecycle, and idempotent marketplace receipt handlers."
    >
      {/* ── HEADER ── */}
      <section className="bg-mint/30 border-b border-ink/10 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <Badge color="mint">Luau Code Vault</Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight font-bold">
              Production Architecture & Patterns for Roblox
            </h1>
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              Tested Luau patterns designed to handle concurrent players cleanly. Free to inspect, adapt, and integrate directly into your experience.
            </p>
          </div>
        </div>
      </section>

      {/* ── SNIPPETS LIST ── */}
      <Section background="cream">
        <div className="max-w-4xl mx-auto space-y-16">
          {snippets.map((snip) => (
            <div
              key={snip.id}
              id={snip.id}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6 scroll-mt-24"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">
                    {snip.category}
                  </span>
                  <h2 className="font-display text-2xl text-ink font-bold mt-1">
                    {snip.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    {snip.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(snip.id, snip.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all self-start sm:self-auto cursor-pointer ${
                    copiedId === snip.id
                      ? 'bg-mint text-ink border-ink/30 font-bold'
                      : 'bg-cream text-ink border-ink/20 hover:border-ink/40'
                  }`}
                >
                  {copiedId === snip.id ? '✓ Copied to clipboard' : 'Copy Luau Code'}
                </button>
              </div>

              {/* Why Crucial Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F4] border border-ink/10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9e3a12] block">
                  Why Standard Tutorials Fall Short:
                </span>
                <p className="text-xs sm:text-sm text-ink leading-relaxed">
                  {snip.whyCrucial}
                </p>
              </div>

              {/* Code Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-ink-soft px-1">
                  <span>Luau Script (Strict Typed)</span>
                  <span>Server-Side Only</span>
                </div>
                <div className="p-5 rounded-2xl bg-ink text-[#f5efe6] font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                  <pre>{snip.code}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CONSULTATION PROMPT ── */}
      <Section background="butter-tint">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Badge color="butter">Need Architecture Review?</Badge>
          <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">
            Working with a Fragile or Lagging Luau Codebase?
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            We perform architectural audits inside Roblox Studio: memory leak profiling, RemoteEvent sanitization, and DataStore throughput optimization.
          </p>
          <Button href="/contact?service=luau-scripting-review" variant="primary" size="lg">
            Discuss Your Game Architecture &rarr;
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
