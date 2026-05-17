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
  title: 'Landing/Hero/Stats',
  component: Hero as any,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [sharedSyncDecorator],
  argTypes: commonArgTypes,
  args: {
    ...commonArgs,
    focusSection: 'stats',
  },
};

export default meta;
type Story = StoryObj<StorybookHeroProps>;

// Story: Isolated Stats Animation
export const IsolatedStats: Story = {
  render: HeroRender,
  name: 'Isolated Stats Animation',
  args: {
    ...commonArgs,
    focusSection: 'stats',
    statsDuration: 0.6,
    statsYOffset: 15,
  },
};
