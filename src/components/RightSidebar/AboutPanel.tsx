import { Panel, PanelHeading } from "./internals"

export type AboutPanelProps = {
  text: string
}

export function AboutPanel({ text }: AboutPanelProps) {
  return (
    <Panel className="shrink-0">
      <PanelHeading>About</PanelHeading>
      <div className="h-sidebar-tracks min-h-0 overflow-y-auto scrollbar-hide">
        <p className="text-base font-medium text-text-primary leading-[1.5] whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </Panel>
  )
}
