import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'In progress' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Success: Story = { args: { variant: 'success', children: 'Completed' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Needs attention' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Critical' } }
