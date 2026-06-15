"use client"

import { useState, type Dispatch, type FC, type SetStateAction, type SVGProps } from "react"
import {
  ChevronDown,
  Download01,
  DotsVertical,
  Edit01,
  Move,
  Play,
  Plus,
  Share06,
  Star01,
  Trash01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import type { StoreCollection, StoreItem, StoreItemType } from "./mock-data"

// ── Public types ──────────────────────────────────────────────────────────────

export type MyStoreProps = {
  mode?: "view" | "manage"
  collections: StoreCollection[]
  onChange?: Dispatch<SetStateAction<StoreCollection[]>>
  /** Fired when user clicks "Edit Store" — switch to manage mode */
  onEditStore?: () => void
  /** Fired when user clicks "Save Changes" — exit manage mode */
  onSave?: () => void
  onAddItems?: (collectionId: string) => void
  onShowAll?: (collectionId: string) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComponent = FC<
  SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
    "aria-hidden"?: boolean | "true" | "false"
  }
>

const WIDE_TYPES = new Set<StoreItemType>(["article", "video", "podcast"])
const PORTRAIT_TYPES = new Set<StoreItemType>(["book"])
const HAS_PLAY = new Set<StoreItemType>(["video", "podcast", "audiobook", "song", "album"])

function thumbnailAspect(type: StoreItemType) {
  if (PORTRAIT_TYPES.has(type)) return "aspect-[4/5]"
  if (WIDE_TYPES.has(type) && type === "article") return "aspect-[237/100]"
  if (WIDE_TYPES.has(type)) return "aspect-video"
  return "aspect-square"
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GlassBtn({
  label,
  Icon,
  onClick,
  danger = false,
}: {
  label: string
  Icon: IconComponent
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        "flex items-center justify-center size-[22px] rounded-[4px] shrink-0 cursor-pointer",
        "backdrop-blur-[8px] hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface",
        danger ? "bg-red-900/70" : "bg-overlay-btn",
      )}
    >
      <Icon size={14} color="white" aria-hidden="true" className="shrink-0" />
    </button>
  )
}

function StoreItemCard({
  item,
  isManaging,
  onRemove,
}: {
  item: StoreItem
  isManaging: boolean
  onRemove?: () => void
}) {
  const isWide = WIDE_TYPES.has(item.type)

  return (
    <div
      className={cx(
        "flex flex-col gap-2 shrink-0",
        isWide ? "w-[260px]" : "w-[160px]",
      )}
    >
      {/* Thumbnail */}
      <div className="relative">
        <div
          className={cx(
            "relative overflow-hidden rounded-md bg-app-card border border-black/10 w-full",
            thumbnailAspect(item.type),
          )}
        >
          {item.thumbnailUrl && (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          {HAS_PLAY.has(item.type) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex items-center justify-center size-12 rounded-full bg-overlay-btn backdrop-blur-[8px]">
                <Play size={20} color="white" aria-hidden="true" className="shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Overlay action buttons */}
        {isManaging ? (
          <>
            {/* Drag handle — top-left */}
            <div className="absolute top-2 left-2">
              <GlassBtn label="Drag to reorder" Icon={Move} />
            </div>
            {/* Delete — top-right */}
            {onRemove && (
              <div className="absolute top-2 right-2">
                <GlassBtn label="Remove from collection" Icon={Trash01} onClick={onRemove} danger />
              </div>
            )}
          </>
        ) : (
          <div className="absolute top-2 right-2 flex flex-col gap-0.5">
            <GlassBtn label="More options" Icon={DotsVertical} />
            <GlassBtn label="Share" Icon={Share06} />
            <GlassBtn label="Save to wishlist" Icon={Star01} />
            <GlassBtn label="Download" Icon={Download01} />
          </div>
        )}
      </div>

      {/* Title + creator */}
      <div className="flex flex-col">
        <p className="text-heading-card text-text-primary truncate">{item.title}</p>
        <p className="text-xs font-medium text-text-tertiary truncate">{item.creator}</p>
      </div>
    </div>
  )
}

function CollectionSection({
  collection,
  isManaging,
  onShowAll,
  onAddItems,
  onRename,
  onRemoveItem,
}: {
  collection: StoreCollection
  isManaging: boolean
  onShowAll?: () => void
  onAddItems?: () => void
  onRename?: (title: string) => void
  onRemoveItem?: (itemId: string) => void
}) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(collection.title)

  function commitRename() {
    const trimmed = draftTitle.trim()
    if (trimmed && trimmed !== collection.title) onRename?.(trimmed)
    else setDraftTitle(collection.title)
    setEditingTitle(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full shrink-0">
      {/* Collection header */}
      <div className="flex items-center justify-between w-full shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {isManaging && editingTitle ? (
            <input
              autoFocus
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => {
                if (e.key === "Enter") commitRename()
                if (e.key === "Escape") { setDraftTitle(collection.title); setEditingTitle(false) }
              }}
              className={cx(
                "text-heading-section-strong text-text-primary bg-transparent border-b border-app-border",
                "focus:outline-none focus:border-brand-500 min-w-0 w-full max-w-xs",
              )}
            />
          ) : (
            <h2 className="text-heading-section-strong text-text-primary truncate">
              {collection.title}
            </h2>
          )}
          {isManaging && !editingTitle && (
            <button
              type="button"
              aria-label="Rename collection"
              onClick={() => setEditingTitle(true)}
              className="flex items-center justify-center size-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 shrink-0"
            >
              <Edit01 size={16} color="currentColor" aria-hidden="true" className="shrink-0" />
            </button>
          )}
        </div>

        {!isManaging && (
          <button
            type="button"
            onClick={onShowAll}
            className="hidden lg:block text-label-button text-text-primary hover:text-text-secondary shrink-0 transition-colors duration-150 focus-visible:outline-none"
          >
            Show all
          </button>
        )}
      </div>

      {/* Horizontal card row */}
      <div className="overflow-x-auto scrollbar-hide pb-1">
        <div className="flex gap-6 w-max">
          {/* "Add New" placeholder — first in row when managing */}
          {isManaging && (
            <button
              type="button"
              onClick={onAddItems}
              aria-label="Add items to collection"
              className={cx(
                "flex flex-col items-center justify-center gap-2 shrink-0 w-[160px] aspect-square",
                "rounded-md border border-dashed border-app-border",
                "text-text-tertiary hover:text-text-secondary hover:border-app-border-hover",
                "transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
              )}
            >
              <Plus size={20} color="currentColor" aria-hidden="true" className="shrink-0" />
              <span className="text-label-button">Add New</span>
            </button>
          )}
          {collection.items.map(item => (
            <StoreItemCard
              key={item.id}
              item={item}
              isManaging={isManaging}
              onRemove={isManaging ? () => onRemoveItem?.(item.id) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Mobile "Show All" button (view mode only) */}
      {!isManaging && (
        <button
          type="button"
          onClick={onShowAll}
          className="flex items-center justify-center gap-1 w-full py-2 text-label-button text-text-tertiary hover:text-text-secondary transition-colors duration-150 focus-visible:outline-none lg:hidden"
        >
          <ChevronDown size={20} color="currentColor" aria-hidden="true" className="shrink-0" />
          Show All
        </button>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MyStore({
  mode = "view",
  collections,
  onChange,
  onEditStore,
  onSave,
  onAddItems,
  onShowAll,
  className,
}: MyStoreProps) {
  const isManaging = mode === "manage"

  function handleRenameCollection(id: string, title: string) {
    onChange?.(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }

  function handleRemoveItem(collectionId: string, itemId: string) {
    onChange?.(prev =>
      prev.map(c =>
        c.id === collectionId
          ? { ...c, items: c.items.filter(i => i.id !== itemId) }
          : c,
      ),
    )
  }

  function handleNewCollection() {
    const newCol: StoreCollection = {
      id: `col-${Date.now()}`,
      title: "New Collection",
      items: [],
    }
    onChange?.(prev => [newCol, ...prev])
  }

  const isEmpty = collections.length === 0

  return (
    <div className={cx("flex flex-col gap-8 w-full", className)}>
      {/* Header action row */}
      <div className="flex items-center justify-between gap-3 shrink-0 w-full">
        {isManaging ? (
          <>
            <button
              type="button"
              onClick={handleNewCollection}
              className={cx(
                "inline-flex items-center gap-1.5 text-label-button text-text-primary",
                "hover:text-text-secondary transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded-md"
              )}
            >
              New Collection
              <Plus size={16} color="currentColor" aria-hidden="true" className="shrink-0" />
            </button>
            <Button variant="primary" size="sm" onClick={onSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="primary" size="sm" onClick={onEditStore}>
            Edit Store
          </Button>
        )}
      </div>

      {/* Collections, or empty state in manage mode */}
      {isEmpty && isManaging ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-body-default text-text-primary max-w-[360px]">
            Build your store from items in your library and earn sats when your followers discover them
          </p>
          <button
            type="button"
            onClick={handleNewCollection}
            className={cx(
              "inline-flex items-center gap-1.5 text-label-button text-text-primary",
              "hover:text-text-secondary transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded-md"
            )}
          >
            New Collection
            <Plus size={16} color="currentColor" aria-hidden="true" className="shrink-0" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-14 w-full">
          {collections.map(collection => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              isManaging={isManaging}
              onShowAll={() => onShowAll?.(collection.id)}
              onAddItems={() => onAddItems?.(collection.id)}
              onRename={title => handleRenameCollection(collection.id, title)}
              onRemoveItem={itemId => handleRemoveItem(collection.id, itemId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
