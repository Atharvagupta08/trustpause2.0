{
  "brand": {
    "name": "TrustPause 2.0",
    "tagline": "Ambient Human Firewall",
    "attributes": [
      "credible",
      "premium",
      "high-contrast",
      "calm-under-pressure",
      "intervention-forward",
      "projector-legible"
    ],
    "design_style_fusion": {
      "layout_principle": "Bento-grid security dashboard (Behance CyberPulse-style modular telemetry) + device-simulator stage",
      "surface_style": "Dark zinc/slate with subtle noise + thin borders + soft elevation (no glossy gradients)",
      "interaction_style": "Framer-motion micro-interactions + haptic/audio cue indicators + deliberate friction patterns (pause ring, hold-to-confirm)"
    },
    "inspiration_refs": {
      "dashboards": [
        {
          "title": "CyberPulse Bento Grid Cybersecurity Dashboard",
          "url": "https://www.behance.net/gallery/245989005/CyberPulse-Bento-Grid-Cybersecurity-Dashboard",
          "takeaways": [
            "bento modular cards",
            "high scanability",
            "thin separators + dense telemetry"
          ]
        },
        {
          "title": "Threat Watch Cyber Security Dashboard",
          "url": "https://www.behance.net/gallery/246078923/Threat-WatchCyber-Security-Dashboard-UI-Design",
          "takeaways": [
            "alert severity color coding",
            "timeline/event feed patterns",
            "KPI header widgets"
          ]
        },
        {
          "title": "Riskora Cybersecurity Risk Management Mobile UI",
          "url": "https://dribbble.com/shots/26912782-Riskora-Cybersecurity-Risk-Management-Mobile-App-UI-Figma",
          "takeaways": [
            "mobile-first card rhythm",
            "compact risk chips",
            "donut/gauge emphasis"
          ]
        }
      ],
      "phone_frame": [
        {
          "title": "react-mockframe / react-mockframe-phones",
          "url": "https://github.com/D4RK-777/react-mockframe-phones",
          "takeaways": [
            "device frame wrapper option",
            "notch/dynamic-island patterns",
            "useful for simulator mode"
          ]
        }
      ]
    }
  },

  "typography": {
    "google_fonts": {
      "heading": {
        "family": "Space Grotesk",
        "weights": ["500", "600", "700"],
        "usage": "All headings, KPI numbers, tab labels"
      },
      "body": {
        "family": "IBM Plex Sans",
        "weights": ["400", "500", "600"],
        "usage": "Body copy, helper text, modal explanations"
      },
      "mono": {
        "family": "IBM Plex Mono",
        "weights": ["400", "500"],
        "usage": "Domains, UPI IDs, technical architecture labels"
      }
    },
    "tailwind_font_setup": {
      "instructions": [
        "Add Google Fonts <link> tags in public/index.html for Space Grotesk + IBM Plex Sans + IBM Plex Mono.",
        "In tailwind.config.js extend fontFamily: { sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui'], display: ['Space Grotesk', 'ui-sans-serif'], mono: ['IBM Plex Mono', 'ui-monospace'] }",
        "Use className='font-display' for headings and 'font-sans' for body; use 'font-mono' for domains/IDs."
      ]
    },
    "type_scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight",
      "h2": "text-base md:text-lg font-sans text-zinc-300",
      "kpi_number": "text-2xl sm:text-3xl font-display font-semibold tabular-nums",
      "body": "text-sm sm:text-base font-sans leading-relaxed text-zinc-200",
      "small": "text-xs text-zinc-400",
      "mono_inline": "text-xs sm:text-sm font-mono text-zinc-200"
    }
  },

  "color_system": {
    "palette_constraints": {
      "must_use": [
        "Slate/Zinc backgrounds",
        "Emerald = safe",
        "Amber = warning",
        "Crimson/Red = danger/intervention"
      ],
      "notes": [
        "No purple accents.",
        "Avoid large gradients; keep surfaces mostly solid dark with subtle noise.",
        "Use color primarily for state and focus, not decoration."
      ]
    },
    "design_tokens_css": {
      "path": "/app/frontend/src/index.css",
      "instructions": [
        "Replace the current :root/.dark tokens with the following dark-first tokens.",
        "Keep tokens in HSL to match shadcn conventions.",
        "Default app should run in dark mode by applying class 'dark' on <html> or <body>."
      ],
      "tokens": {
        "--background": "240 6% 8%",
        "--foreground": "0 0% 98%",
        "--card": "240 6% 10%",
        "--card-foreground": "0 0% 98%",
        "--popover": "240 6% 10%",
        "--popover-foreground": "0 0% 98%",

        "--primary": "142 72% 45%",
        "--primary-foreground": "144 70% 8%",

        "--secondary": "240 5% 16%",
        "--secondary-foreground": "0 0% 98%",

        "--muted": "240 5% 14%",
        "--muted-foreground": "240 5% 65%",

        "--accent": "240 5% 16%",
        "--accent-foreground": "0 0% 98%",

        "--destructive": "0 72% 52%",
        "--destructive-foreground": "0 0% 98%",

        "--border": "240 5% 18%",
        "--input": "240 5% 18%",
        "--ring": "142 72% 45%",

        "--radius": "0.75rem",

        "--safe": "142 72% 45%",
        "--safe-2": "142 60% 35%",
        "--warn": "38 92% 50%",
        "--warn-2": "38 85% 42%",
        "--danger": "0 72% 52%",
        "--danger-2": "0 62% 44%",

        "--surface-1": "240 6% 10%",
        "--surface-2": "240 5% 13%",
        "--surface-3": "240 5% 16%",

        "--shadow": "0 0% 0%",
        "--shadow-elev-1": "0 0% 0% / 0.35",
        "--shadow-elev-2": "0 0% 0% / 0.55"
      }
    },
    "tailwind_usage": {
      "backgrounds": [
        "bg-zinc-950 (page)",
        "bg-zinc-900/60 (panels)",
        "bg-zinc-900 (cards)",
        "border-zinc-800 (dividers)"
      ],
      "state_colors": {
        "safe": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        "warning": "text-amber-300 bg-amber-500/10 border-amber-500/20",
        "danger": "text-red-400 bg-red-500/10 border-red-500/20"
      },
      "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-0"
    },
    "texture": {
      "noise_overlay": {
        "usage": "Apply subtle noise to the whole app background and to the phone frame bezel only.",
        "css_snippet": ".tp-noise { position: relative; }\n.tp-noise:before { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E'); mix-blend-mode: overlay; opacity: 0.35; border-radius: inherit; }"
      }
    }
  },

  "layout": {
    "global": {
      "page_padding": "px-4 sm:px-6 lg:px-8",
      "max_width": "max-w-[1280px]",
      "grid": {
        "desktop": "lg:grid lg:grid-cols-12 lg:gap-6",
        "stage": "lg:col-span-8",
        "side_panel": "lg:col-span-4"
      },
      "spacing": {
        "card_padding": "p-4 sm:p-5",
        "section_gap": "gap-4 sm:gap-6",
        "stack_gap": "space-y-3 sm:space-y-4"
      }
    },
    "header": {
      "behavior": "Sticky, blurred, with thin border; contains logo/title, live risk gauge, view toggle, mute toggle, reset.",
      "classes": "sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/50",
      "height": "min-h-[64px]",
      "content_layout": "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    },
    "scenario_tabs": {
      "component": "shadcn Tabs",
      "classes": "w-full",
      "tab_list": "grid grid-cols-2 sm:flex sm:flex-wrap gap-2",
      "tab_trigger": "justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50"
    },
    "phone_frame_simulator": {
      "goal": "In Phone mode, render the scenario stage inside a realistic phone frame with notch + status bar + home indicator.",
      "implementation": {
        "preferred": "Custom CSS phone frame wrapper (no extra deps).",
        "optional_library": {
          "name": "react-mockframe-phones",
          "note": "Optional; only if main agent wants a prebuilt device frame. Keep content status bar OFF to avoid double bars.",
          "url": "https://github.com/D4RK-777/react-mockframe-phones"
        }
      },
      "classes": {
        "outer": "mx-auto w-full max-w-[420px]",
        "bezel": "tp-noise relative rounded-[2.25rem] border border-zinc-800 bg-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
        "screen": "relative overflow-hidden rounded-[1.9rem] bg-zinc-950",
        "notch": "absolute left-1/2 top-2 h-6 w-40 -translate-x-1/2 rounded-full bg-zinc-900 border border-zinc-800",
        "statusbar": "flex items-center justify-between px-5 pt-3 text-[11px] text-zinc-300",
        "home_indicator": "absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zinc-700/70"
      }
    }
  },

  "components": {
    "component_path": {
      "use_these_shadcn": [
        "/app/frontend/src/components/ui/button.jsx",
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/tabs.jsx",
        "/app/frontend/src/components/ui/progress.jsx",
        "/app/frontend/src/components/ui/dialog.jsx",
        "/app/frontend/src/components/ui/alert-dialog.jsx",
        "/app/frontend/src/components/ui/drawer.jsx",
        "/app/frontend/src/components/ui/switch.jsx",
        "/app/frontend/src/components/ui/tooltip.jsx",
        "/app/frontend/src/components/ui/separator.jsx",
        "/app/frontend/src/components/ui/scroll-area.jsx",
        "/app/frontend/src/components/ui/sonner.jsx"
      ]
    },

    "risk_gauge": {
      "visual": {
        "type": "Circular gauge with numeric center + severity label chip",
        "size": "h-12 w-12 (header compact) + optional larger h-28 w-28 (side panel)",
        "color_logic": [
          "0-34 safe (emerald)",
          "35-69 warning (amber)",
          "70-100 danger (red)"
        ]
      },
      "implementation_notes": [
        "Use SVG circle with strokeDasharray animation; keep it GPU-friendly (no filters).",
        "Animate value changes with requestAnimationFrame or framer-motion spring.",
        "Add aria-label='Risk score' and aria-live='polite' for the numeric value.",
        "Add data-testid='risk-gauge' and data-testid='risk-gauge-value'."
      ],
      "tailwind_classes": {
        "wrap": "flex items-center gap-3",
        "label": "text-xs text-zinc-400",
        "value": "font-display tabular-nums text-sm text-zinc-100",
        "chip_safe": "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        "chip_warn": "border border-amber-500/20 bg-amber-500/10 text-amber-200",
        "chip_danger": "border border-red-500/20 bg-red-500/10 text-red-300"
      }
    },

    "scenario_stage_cards": {
      "card_style": "Card with subtle border, dense header row, and a clear primary action.",
      "classes": "bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
      "header_row": "flex items-start justify-between gap-3",
      "meta": "text-xs text-zinc-400",
      "primary_button": {
        "variant": "default",
        "classes": "bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
        "danger_variant": "bg-red-500 text-white hover:bg-red-400",
        "warning_variant": "bg-amber-400 text-zinc-950 hover:bg-amber-300"
      }
    },

    "intervention_modal_pause": {
      "component": "shadcn Dialog",
      "behavior": [
        "Triggered when user clicks suspicious link.",
        "Shows animated 10s countdown ring + copy explaining domain mismatch.",
        "Primary safe CTA: 'Open Official Bank App Instead' (emerald).",
        "Secondary: 'Close' (ghost)."
      ],
      "countdown_ring": {
        "spec": "SVG ring with 10 segments or continuous stroke; animate strokeDashoffset each second.",
        "classes": "mx-auto grid place-items-center h-24 w-24 rounded-full bg-zinc-950 border border-zinc-800",
        "center_text": "font-display tabular-nums text-2xl text-zinc-100"
      },
      "copy_block": {
        "domain_line": "Use font-mono and highlight mismatch with red underline.",
        "classes": "rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
      },
      "data_testids": [
        "intervention-modal",
        "intervention-countdown",
        "intervention-safe-cta",
        "intervention-close"
      ]
    },

    "action_lock_hold_to_confirm": {
      "component": "Custom overlay + shadcn Progress",
      "behavior": [
        "On 'Pay Now' click, block UI with overlay.",
        "Require press-and-hold 3s to override.",
        "Show live progress bar + subtle vibration/audio ticks (respect mute toggle).",
        "Keyboard: Space/Enter should also hold (pointerDown/KeyDown start; pointerUp/KeyUp cancel)."
      ],
      "overlay_classes": "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "panel_classes": "mx-auto mt-[12vh] w-[min(92vw,520px)] rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.65)]",
      "hold_button": {
        "shape": "rounded-xl",
        "classes": "w-full select-none bg-red-500 text-white hover:bg-red-400 active:scale-[0.99]",
        "microcopy": "Hold to Confirm Override",
        "progress": "Use <Progress /> with indicator tinted red-400; height h-2"
      },
      "safety_actions": [
        "Call Saved Contact (secondary)",
        "Cancel Payment (ghost)"
      ],
      "data_testids": [
        "action-lock-overlay",
        "hold-to-confirm-button",
        "hold-progress",
        "call-saved-contact-button",
        "cancel-payment-button"
      ]
    },

    "incoming_call_and_risk_card": {
      "layout": "Call screen card with caller identity + big actions; floating risk card with detected signals.",
      "call_card_classes": "rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5",
      "risk_card_classes": "rounded-xl border border-amber-500/20 bg-amber-500/10 p-4",
      "signals": [
        "Unverified VoIP caller",
        "Secrecy request detected",
        "Authority impersonation"
      ],
      "actions": {
        "end_report": "bg-red-500 text-white hover:bg-red-400",
        "verify": "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      },
      "data_testids": [
        "incoming-call-card",
        "call-risk-card",
        "end-call-report-button",
        "verify-helpline-button"
      ]
    },

    "deepfake_audio_card": {
      "behavior": [
        "Audio play/pause with waveform visualization.",
        "Cognitive risk breakdown bars with additive scoring to 85/100.",
        "Intervention active badge when >= 70."
      ],
      "waveform": {
        "implementation": "Lightweight fake waveform (CSS bars) synced to play state; avoid heavy canvas unless needed.",
        "classes": "flex items-end gap-1 h-10",
        "bar": "w-1 rounded-sm bg-zinc-700 data-[active=true]:bg-emerald-400"
      },
      "breakdown_bars": {
        "component": "shadcn Progress",
        "row_classes": "grid grid-cols-[1fr,auto] items-center gap-3",
        "label": "text-xs text-zinc-300",
        "value": "text-xs font-mono text-zinc-300",
        "tints": {
          "urgency": "bg-amber-500/15",
          "fear": "bg-red-500/15",
          "secrecy": "bg-amber-500/15",
          "synthetic": "bg-red-500/15"
        }
      },
      "data_testids": [
        "deepfake-audio-card",
        "audio-play-toggle",
        "waveform",
        "cognitive-risk-total"
      ]
    },

    "architecture_drawer": {
      "component": "shadcn Drawer",
      "behavior": "Bottom collapsible panel; contains platform hook cards + privacy callout.",
      "drawer_handle": "Use a small grabber + label 'Architecture (No 24/7 recording)'.",
      "content_layout": "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
      "hook_card": {
        "classes": "rounded-xl border border-zinc-800 bg-zinc-950/40 p-4",
        "title": "font-display text-sm text-zinc-100",
        "body": "text-xs text-zinc-400"
      },
      "privacy_callout": {
        "classes": "rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4",
        "copy": "No 24/7 background screen recording. Uses platform-approved hooks only."
      },
      "data_testids": [
        "architecture-drawer",
        "architecture-drawer-toggle"
      ]
    }
  },

  "motion": {
    "principles": [
      "Use motion to communicate state changes (risk rising/falling, intervention active), not decoration.",
      "Prefer transform + opacity animations (GPU-friendly).",
      "Respect prefers-reduced-motion: reduce ring spins, disable parallax, shorten durations."
    ],
    "framer_motion_specs": {
      "durations_ms": {
        "micro": 120,
        "standard": 180,
        "modal": 220,
        "risk_spring": 260
      },
      "easing": {
        "standard": "[0.2, 0.8, 0.2, 1]",
        "snappy": "[0.16, 1, 0.3, 1]"
      },
      "patterns": {
        "tab_switch": "Animate stage content with opacity 0->1 and y 6->0",
        "overlay_enter": "opacity 0->1 + scale 0.98->1",
        "risk_change": "spring on numeric value + subtle pulse ring when crossing thresholds"
      }
    },
    "no_transition_all": true
  },

  "sound_haptics": {
    "requirements": [
      "Global mute toggle in header.",
      "Use existing /app/frontend/src/lib/feedback.js; do not change its API.",
      "Provide visual cue when sound/haptics fire (small 'cue' dot blink near actions).",
      "Respect user preference and reduced motion."
    ],
    "ui_pattern": {
      "mute_toggle": "shadcn Switch with label 'Cues' and tooltip explaining audio/vibrate.",
      "data_testids": ["mute-cues-toggle"]
    }
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast on dark backgrounds.",
      "All dialogs/drawers must trap focus (shadcn handles).",
      "All interactive elements must have visible focus ring.",
      "Hold-to-confirm must be keyboard operable.",
      "Use aria-live for risk score updates and countdown."
    ],
    "aria_and_labels": {
      "risk": "aria-label='Risk score out of 100'",
      "countdown": "aria-live='assertive' for last 3 seconds only; otherwise polite",
      "tabs": "Ensure TabsList/Triggers have accessible names"
    }
  },

  "testing": {
    "data_testid_rules": {
      "format": "kebab-case",
      "must_apply_to": [
        "buttons",
        "links",
        "inputs",
        "tab triggers",
        "toggles",
        "modals",
        "drawers",
        "risk gauge",
        "timeline items"
      ],
      "examples": [
        "data-testid='reset-simulation-button'",
        "data-testid='scenario-tab-kyc-phishing'",
        "data-testid='sms-link'",
        "data-testid='pay-now-button'"
      ]
    }
  },

  "image_urls": {
    "note": "This prototype is UI-first; avoid stock photos. Use icons + subtle noise only.",
    "categories": [
      {
        "category": "background_texture",
        "description": "Inline SVG noise (see tp-noise) — no external image required.",
        "urls": []
      }
    ]
  },

  "instructions_to_main_agent": [
    "Remove CRA default App.css centering styles; do not use .App { text-align:center }.",
    "Set dark mode by default (add 'dark' class at root).",
    "Implement header as sticky with risk gauge + toggles + reset.",
    "Use shadcn Tabs for scenarios; each tab shows a risk badge.",
    "Implement Phone Frame Simulator wrapper; in phone mode, hide desktop side panel and constrain stage width.",
    "Risk Gauge must be live reactive: increase on risky actions, decrease on safe actions/cancel/reset.",
    "Use existing hooks: useCountdown.js for 10s pause; usePressHold.js for 3s hold; feedback.js for cues.",
    "All interactive elements and key info must include data-testid.",
    "Use lucide-react icons only (Shield, AlertTriangle, PhoneCall, AudioLines, Link, Lock, Gauge).",
    "Use framer-motion for transitions; respect prefers-reduced-motion.",
    "Architecture Drawer must be shadcn Drawer at bottom with platform hook cards + privacy callout."
  ],

  "general_ui_ux_design_guidelines_appendix": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
