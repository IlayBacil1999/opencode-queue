import { For, Show, createMemo } from "solid-js"
import { createStore } from "solid-js/store"
import { Button } from "@opencode-ai/ui/button"
import { DockTray } from "@opencode-ai/ui/dock-surface"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { useLanguage } from "@/context/language"

export function SessionFollowupDock(props: {
  items: { id: string; text: string }[]
  sending?: string
  onSend: (id: string) => void
  onEdit: (id: string) => void
  onRemove?: (id: string) => void
  drainProgress?: { current: number; total: number }
  countdown?: { remaining: number }
}) {
  const language = useLanguage()
  const [store, setStore] = createStore({
    collapsed: true,
  })

  const toggle = () => setStore("collapsed", (value) => !value)
  const total = createMemo(() => props.items.length)
  const label = createMemo(() =>
    language.t(total() === 1 ? "session.followupDock.summary.one" : "session.followupDock.summary.other", {
      count: total(),
    }),
  )
  const preview = createMemo(() => props.items[0]?.text ?? "")

  return (
    <DockTray
      data-component="session-followup-dock"
      style={{
        "margin-bottom": "-0.875rem",
        "border-bottom-left-radius": 0,
        "border-bottom-right-radius": 0,
      }}
    >
      <div
        class="pl-3 pr-2 py-2 flex items-center gap-2"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          toggle()
        }}
      >
        <span class="shrink-0 text-13-medium text-text-strong cursor-default">{label()}</span>
        <Show when={store.collapsed && preview()}>
          <span class="min-w-0 flex-1 truncate text-13-regular text-text-base cursor-default">{preview()}</span>
        </Show>
        <div class="ml-auto shrink-0">
          <IconButton
            data-collapsed={store.collapsed ? "true" : "false"}
            icon="chevron-down"
            size="normal"
            variant="ghost"
            style={{ transform: `rotate(${store.collapsed ? 180 : 0}deg)` }}
            onMouseDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.stopPropagation()
              toggle()
            }}
            aria-label={
              store.collapsed ? language.t("session.followupDock.expand") : language.t("session.followupDock.collapse")
            }
          />
        </div>
      </div>

      <Show when={store.collapsed}>
        <div class="h-5" aria-hidden="true" />
      </Show>

      <Show when={props.drainProgress && !store.collapsed}>
        <div class="px-3 pb-2">
          <div style="height:3px;background:var(--bg-layer-02,#2e2e2e);border-radius:4px;overflow:hidden">
            <div style="height:100%;background:var(--v2-text-text-accent,#a2bcff);border-radius:4px;width:${Math.round((props.drainProgress!.current / props.drainProgress!.total) * 100)}%"></div>
          </div>
          <div style="font-size:11px;color:var(--text-faint,#808080);margin-top:4px">
            {props.drainProgress!.current + 1} of {props.drainProgress!.total}
          </div>
        </div>
      </Show>

      <Show when={props.countdown && !store.collapsed}>
        <div class="px-3 pb-2">
          <div style="display:flex;align-items:center;gap:8px;padding:4px 8px;background:var(--bg-layer-01,#242424);border-radius:4px;font-size:11px;color:var(--text-muted,#aeaeae)">
            <span>▶ Next in</span>
            <span style="font-size:13px;font-weight:530;font-variant-numeric:tabular-nums;color:var(--v2-text-text-accent,#a2bcff)">{props.countdown!.remaining}</span>
          </div>
        </div>
      </Show>

      <Show when={!store.collapsed}>
        <div class="px-3 pb-7 flex flex-col gap-1.5 max-h-42 overflow-y-auto no-scrollbar">
          <For each={props.items}>
            {(item) => (
              <div class="flex items-center gap-2 min-w-0 py-1">
                <span class="min-w-0 flex-1 truncate text-13-regular text-text-strong">{item.text}</span>
                <Button
                  size="small"
                  variant="secondary"
                  class="shrink-0"
                  disabled={!!props.sending}
                  onClick={() => props.onSend(item.id)}
                >
                  {language.t("session.followupDock.sendNow")}
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  class="shrink-0"
                  disabled={!!props.sending}
                  onClick={() => props.onEdit(item.id)}
                >
                  {language.t("session.followupDock.edit")}
                </Button>
                <Show when={props.onRemove}>
                  <Button
                    size="small"
                    variant="ghost"
                    class="shrink-0"
                    disabled={!!props.sending}
                    onClick={() => props.onRemove?.(item.id)}
                  >
                    Remove
                  </Button>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </DockTray>
  )
}
