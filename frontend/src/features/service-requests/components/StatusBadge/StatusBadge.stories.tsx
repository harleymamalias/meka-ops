import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceRequestStatusBadge } from './StatusBadge';

const meta = {
  title: 'Service Requests/Status Badge',
  component: ServiceRequestStatusBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof ServiceRequestStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = { args: { status: 'PENDING' } };
export const Inspecting: Story = { args: { status: 'INSPECTING' } };
export const InProgress: Story = { args: { status: 'IN_PROGRESS' } };
export const Completed: Story = { args: { status: 'COMPLETED' } };
