"use client"

import { useState, useId } from "react"
import {
  Zap,
  CurrencyDollar,
  UserPlus01,
  RefreshCw01,
  XClose,
  Plus,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type PaymentSplit = {
  id: string
  /** editable npub / pubkey */
  npub: string
  name?: string
  avatarUrl?: string
  /** percentage 0–100 */
  percent: number
}

export type PriceSplitsProps = {
  priceSats: number
  splits: PaymentSplit[]
  hasReferrer: boolean
  referrerNpub: string
  referrerPercent: number
  onPriceChange: (sats: number) => void
  onSplitsChange: (splits: PaymentSplit[]) => void
  onReferrerToggle: (on: boolean) => void
  onReferrerNpubChange: (npub: string) => void
  onReferrerPercentChange: (pct: number) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

const USD_PER_BTC = 68000
const SATS_PER_BTC = 100_000_000

function satsToUsd(sats: number) {
  return ((sats / SATS_PER_BTC) * USD_PER_BTC).toFixed(2)
}

let splitIdCounter = 1000
function newSplitId() {
  return `split-${++splitIdCounter}`
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent shrink-0",
        "transition-colors duration-200",
        checked ? "bg-brand-600" : "bg-app-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      <span
        className={cx(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0",
          "transform transition duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PriceSplits({
  priceSats,
  splits,
  hasReferrer,
  referrerNpub,
  referrerPercent,
  onPriceChange,
  onSplitsChange,
  onReferrerToggle,
  onReferrerNpubChange,
  onReferrerPercentChange,
  className,
}: PriceSplitsProps) {
  const priceInputId = useId()

  // Sats auto-calc per split row
  function rowSats(pct: number) {
    return Math.floor((priceSats * pct) / 100)
  }

  const referrerSats = Math.floor((priceSats * referrerPercent) / 100)

  // Total allocated vs price
  const allocatedSats =
    splits.reduce((sum, s) => sum + rowSats(s.percent), 0) +
    (hasReferrer ? referrerSats : 0)
  const overBy = allocatedSats - priceSats
  const hasError = priceSats > 0 && overBy > 0

  function updateNpub(id: string, npub: string) {
    onSplitsChange(splits.map(s => (s.id === id ? { ...s, npub } : s)))
  }

  function updatePercent(id: string, raw: string) {
    const val = Math.max(0, Math.min(100, Number(raw) || 0))
    onSplitsChange(splits.map(s => (s.id === id ? { ...s, percent: val } : s)))
  }

  function removeSplit(id: string) {
    onSplitsChange(splits.filter(s => s.id !== id))
  }

  function addZapSplit() {
    onSplitsChange([...splits, { id: newSplitId(), npub: "", percent: 0 }])
  }

  function splitEvenly() {
    if (splits.length === 0) return
    const each = Math.floor(100 / splits.length)
    const remainder = 100 - each * splits.length
    onSplitsChange(splits.map((s, i) => ({ ...s, percent: i === 0 ? each + remainder : each })))
  }

  return (
    <div className={cx("flex flex-col gap-5", className)}>

      {/* ── Price card ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        <div className="flex flex-col gap-1">
          <h3 className="text-heading-card text-text-primary">Price</h3>
          <p className="text-body-small text-text-tertiary">The customer must pay this amount to unlock it.</p>
        </div>

        {/* Two-column price inputs */}
        <div className="flex items-center gap-3">
          {/* Sats input */}
          <div className="flex items-center gap-2 flex-1 px-3 h-10 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
            <Zap size={16} color="var(--color-text-tertiary)" aria-hidden="true" className="shrink-0" />
            <input
              id={priceInputId}
              type="number"
              min={0}
              value={priceSats || ""}
              onChange={e => onPriceChange(Math.max(0, Number(e.target.value) || 0))}
              placeholder="0"
              aria-label="Price in sats"
              className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs text-text-tertiary shrink-0">sats</span>
          </div>

          {/* USD display */}
          <div className="flex items-center gap-2 flex-1 px-3 h-10 rounded-lg border border-app-border bg-app-surface">
            <CurrencyDollar size={16} color="var(--color-text-tertiary)" aria-hidden="true" className="shrink-0" />
            <span className="text-sm text-text-tertiary">{satsToUsd(priceSats)}</span>
          </div>
        </div>
      </div>

      {/* ── Payment Split card ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-heading-card text-text-primary">Payment Split</h3>
            <p className="text-body-small text-text-tertiary">Who should get paid when someone buys it?</p>
          </div>
          {splits.length > 1 && (
            <Button variant="secondary" size="sm" iconLeft={RefreshCw01} onClick={splitEvenly}>
              Split Evenly
            </Button>
          )}
        </div>

        {/* Table */}
        {splits.length > 0 && (
          <div className="flex flex-col gap-1">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_80px_52px_28px] gap-2 px-2 pb-1">
              <span className="text-xs font-semibold text-text-tertiary">npub</span>
              <span className="text-xs font-semibold text-text-tertiary text-center">sats</span>
              <span className="text-xs font-semibold text-text-tertiary text-center">%</span>
              <div />
            </div>

            {/* Split rows */}
            {splits.map(split => (
              <div
                key={split.id}
                className="grid grid-cols-[1fr_80px_52px_28px] gap-2 items-center p-2 rounded-lg bg-app-surface border border-app-border">
                {/* npub (avatar + editable input) */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    src={split.avatarUrl}
                    name={split.name || split.npub || "?"}
                    size="xs"
                    className="border border-black/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={split.npub}
                    onChange={e => updateNpub(split.id, e.target.value)}
                    placeholder="npub…"
                    aria-label="Recipient npub"
                    className="flex-1 min-w-0 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder truncate"
                  />
                </div>

                {/* Sats (auto-calculated, display-only) */}
                <div className="flex items-center justify-center">
                  <span className="text-xs text-text-secondary font-medium tabular-nums">
                    {rowSats(split.percent).toLocaleString()}
                  </span>
                </div>

                {/* Percent input */}
                <div className="flex items-center gap-0.5 justify-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={split.percent}
                    onChange={e => updatePercent(split.id, e.target.value)}
                    aria-label={`Split percentage`}
                    className={cx(
                      "w-10 text-center text-xs font-semibold bg-app-card border rounded px-1 py-0.5 outline-none",
                      "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                      "border-app-border text-text-primary",
                      "focus-visible:ring-1 focus-visible:ring-brand-500/50"
                    )}
                  />
                </div>

                {/* Remove */}
                <div className="flex items-center justify-center">
                  <IconButton
                    icon={XClose}
                    label="Remove split"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeSplit(split.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Zap Split */}
        <button
          type="button"
          onClick={addZapSplit}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-400 transition-colors duration-150 cursor-pointer focus-visible:outline-none w-fit">
          <Plus size={16} color="currentColor" aria-hidden="true" />
          Add Zap Split
        </button>

        {/* Error */}
        {hasError && (
          <p className="text-xs text-text-error-primary font-medium">
            Too many sats allocated. Over by {overBy.toLocaleString()} sats.
          </p>
        )}

        {/* Referrer commission divider */}
        <div className="border-t border-app-border pt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={cx("text-sm font-semibold", hasReferrer ? "text-text-primary" : "text-text-tertiary")}>
              Any commission for the people who share the content?
            </span>
            <Toggle
              checked={hasReferrer}
              onChange={onReferrerToggle}
              label="Toggle referrer commission"
            />
          </div>

          {hasReferrer && (
            <div className="grid grid-cols-[1fr_80px_52px_28px] gap-2 items-center p-2 rounded-lg bg-app-surface border border-app-border">
              {/* Referrer npub */}
              <div className="flex items-center gap-2 min-w-0">
                <Avatar
                  src={undefined}
                  name="R"
                  size="xs"
                  className="border border-black/10 shrink-0"
                />
                <input
                  type="text"
                  value={referrerNpub}
                  onChange={e => onReferrerNpubChange(e.target.value)}
                  placeholder="Referrer"
                  aria-label="Referrer npub"
                  className="flex-1 min-w-0 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder truncate"
                />
              </div>

              {/* Referrer sats (auto-calculated) */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-text-secondary font-medium tabular-nums">
                  {referrerSats.toLocaleString()}
                </span>
              </div>

              {/* Referrer percent */}
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={referrerPercent}
                  onChange={e =>
                    onReferrerPercentChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))
                  }
                  aria-label="Referrer commission percentage"
                  className={cx(
                    "w-10 text-center text-xs font-semibold bg-app-card border border-app-border rounded px-1 py-0.5 outline-none",
                    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                    "text-text-primary focus-visible:ring-1 focus-visible:ring-brand-500/50"
                  )}
                />
              </div>

              <div />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
