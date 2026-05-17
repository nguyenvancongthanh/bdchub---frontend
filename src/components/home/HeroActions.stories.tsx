import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Hero from './Hero';
import {
  sharedSyncDecorator,
  HeroRender,
  commonArgTypes,
  commonArgs,
  StorybookHeroProps
} from './HeroStoriesHelper';

const meta: Meta<StorybookHeroProps> = {
  title: 'Landing/Hero/Actions',
  component: Hero as any,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [sharedSyncDecorator],
  argTypes: commonArgTypes,
  args: {
    ...commonArgs,
    focusSection: 'actions',
  },
};

export default meta;
type Story = StoryObj<StorybookHeroProps>;

// Story: Isolated Actions Animation
export const IsolatedActions: Story = {
  render: HeroRender,
  name: 'Isolated Actions Animation',
  args: {
    ...commonArgs,
    focusSection: 'actions',
    actionsDuration: 0.6,
    actionsYOffset: 15,
  },
};
