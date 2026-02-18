import level1 from '@/assets/images/medals/level-1.png'
import level2 from '@/assets/images/medals/level-2.png'
import level3 from '@/assets/images/medals/level-3.png'
import level4 from '@/assets/images/medals/level-4.png'
import level5 from '@/assets/images/medals/level-5.png'

export type Level = {
	id: string
	name: string
	value: number
	imageUrl: string
	description: string
	top: string
}

export const defaultLevel: Level = {
  id: 'level0',
  name: '-',
  value: 0,
  imageUrl: '',
  description: '',
  top: '0%',
}

/* TODO: reduce the obect keys to the minimum needed */
export const levelsObj: Level[] = [
  {
    id: 'level1',
    name: 'Level 1',
    value: 1,
    imageUrl: level1,
    description: 'TOP 1',
    top: '99%',
  },
  {
    id: 'level2',
    name: 'Level 2',
    value: 2,
    imageUrl: level2,
    description: 'Next 9%',
    top: '90%',
  },
  {
    id: 'level3',
    name: 'Level 3',
    value: 3,
    imageUrl: level3,
    description: 'Next 20%',
    top: '60%',
  },
  {
    id: 'level4',
    name: 'Level 4',
    value: 4,
    imageUrl: level4,
    description: 'Next 20%',
    top: '50%',
  },
  {
    id: 'level5',
    name: 'Level 5',
    value: 5,
    imageUrl: level5,
    description: 'Last 50%',
    top: '50%',
  },
]
