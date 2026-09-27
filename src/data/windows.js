import { CATEGORIES } from './projects.js'

// One Explorer-style folder window per project category
export const FOLDER_WINDOWS = CATEGORIES.map((c, i) => ({
  id: `folder-${c.id}`,
  category: c.id,
  title: c.label,
  icon: '📁',
  initX: 180 + i * 30, initY: 90 + i * 30,
  initW: 740, initH: 470,
  minW: 320, minH: 240,
  onDesktop: false,
}))

const BASE_WINDOWS = [
  {
    id: 'cv',
    title: 'My CV',
    icon: '📄',
    initX: 220, initY: 120,
    initW: 420, initH: 520,
    minW: 280, minH: 200,
    onDesktop: true,
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    initX: 260, initY: 160,
    initW: 240, initH: 362,
    minW: 240, minH: 362,
    resizable: false,
    onDesktop: true,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '🖥️',
    initX: 300, initY: 200,
    initW: 560, initH: 360,
    minW: 300, minH: 200,
    onDesktop: false,
  },
  {
    id: 'bio',
    title: 'bio.txt - Notepad',
    icon: '📝',
    initX: 150, initY: 100,
    initW: 520, initH: 420,
    minW: 280, minH: 200,
    onDesktop: true,
  },
]

export const WINDOWS = [...BASE_WINDOWS, ...FOLDER_WINDOWS]
