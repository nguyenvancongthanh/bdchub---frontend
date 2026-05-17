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
  title: 'Landing/Hero/Description',
  component: Hero as any,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [sharedSyncDecorator],
  argTypes: commonArgTypes,
  args: {
    ...commonArgs,
    focusSection: 'description',
  },
};

export default meta;
type Story = StoryObj<StorybookHeroProps>;

// Story: Isolated Description Animation
export const IsolatedDescription: Story = {
  render: HeroRender,
  name: 'Isolated Description Animation',
  args: {
    ...commonArgs,
    focusSection: 'description',
    descriptionDuration: 0.6,
    descriptionYOffset: 15,
  },
};
