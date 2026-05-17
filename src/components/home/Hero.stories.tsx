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
  title: 'Landing/Hero/Full Hero',
  component: Hero as any,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [sharedSyncDecorator],
  argTypes: commonArgTypes,
  args: commonArgs,
};

export default meta;
type Story = StoryObj<StorybookHeroProps>;

// Story: Full Interactive Hero Animation
export const InteractiveHero: Story = {
  render: HeroRender,
  name: 'Interactive Hero Animation',
  args: {
    ...commonArgs,
    focusSection: 'all',
    totalStagger: 0.65,
    p: 2.0,
    yOffset: 110,
    duration: 0.35,
    easePreset: "Custom Cubic Bezier",
    x1: 0.06,
    y1: 1.0,
    x2: 0.7,
    y2: 1.4,
    enableConfirm: true,
    confirmInitialScale: 0.85,
    confirmDelay: 1.1,
    confirmDuration: 0.3,
    enableTitleFade: false,
  },
};
