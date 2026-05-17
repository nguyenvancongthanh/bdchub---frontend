import { useEffect, useRef } from 'react';
import { useArgs } from 'storybook/preview-api';
import type { ArgTypes } from '@storybook/react';
import Hero, { HeroProps } from './Hero';

export interface StorybookHeroProps extends HeroProps {
  easePreset: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
// Shared dynamic sync decorator that synchronizes parameters through localStorage and custom events
export const sharedSyncDecorator = (Story: any, context: any) => {
  const [, updateArgs] = useArgs();
  const argsRef = useRef(context.args);
  const isInitializedRef = useRef(false);
  const lastStoryIdRef = useRef(context.id);

  // Keep argsRef updated with the latest context.args on every render
  useEffect(() => {
    argsRef.current = context.args;
  });

  // Reset initialization flag when navigating to a different story (handled during render phase for instant sync reset)
  if (lastStoryIdRef.current !== context.id) {
    lastStoryIdRef.current = context.id;
    isInitializedRef.current = false;
  }

  // Destructure primitive syncable properties to ensure a perfectly stable dependency array.
  const {
    totalStagger,
    p,
    yOffset,
    duration,
    easePreset,
    x1,
    y1,
    x2,
    y2,
    enableConfirm,
    confirmInitialScale,
    confirmDelay,
    confirmDuration,
    enableTitleFade,
    titleFadeDuration,
    descriptionDuration,
    descriptionYOffset,
    actionsDuration,
    actionsYOffset,
    statsDuration,
    statsYOffset,
  } = context.args;

  useEffect(() => {
    const coreParams = {
      totalStagger,
      p,
      yOffset,
      duration,
      easePreset,
      x1,
      y1,
      x2,
      y2,
      enableConfirm,
      confirmInitialScale,
      confirmDelay,
      confirmDuration,
      enableTitleFade,
      titleFadeDuration,
      descriptionDuration,
      descriptionYOffset,
      actionsDuration,
      actionsYOffset,
      statsDuration,
      statsYOffset,
    };

    const saved = localStorage.getItem('bdc_motion_lab_sync_state');
    
    if (!saved) {
      // 1. If localStorage is empty, initialize it with current story default args
      localStorage.setItem('bdc_motion_lab_sync_state', JSON.stringify(coreParams));
      isInitializedRef.current = true;
    } else {
      try {
        const parsedSaved = JSON.parse(saved);
        
        // Clean up legacy focusSection if any
        if (parsedSaved && typeof parsedSaved === 'object' && 'focusSection' in parsedSaved) {
          delete parsedSaved.focusSection;
        }

        // Compare current args with saved args
        const diffUpdates: any = {};
        let hasDiff = false;
        
        Object.keys(coreParams).forEach((key) => {
          const k = key as keyof typeof coreParams;
          if (coreParams[k] !== undefined && parsedSaved[k] !== undefined && coreParams[k] !== parsedSaved[k]) {
            diffUpdates[k] = parsedSaved[k];
            hasDiff = true;
          }
        });

        if (hasDiff) {
          if (!isInitializedRef.current) {
            // 2. If not initialized, this is a mount race: restore saved state from localStorage
            updateArgs(diffUpdates);
            // DO NOT set isInitializedRef.current = true yet.
            // We wait for the next render when these diffUpdates actually become the active props.
          } else {
            // 3. If already initialized, this is a user control change: save to localStorage and dispatch event
            localStorage.setItem('bdc_motion_lab_sync_state', JSON.stringify(coreParams));
            window.dispatchEvent(new CustomEvent('bdc_motion_sync_event', { 
              detail: { ...coreParams, _senderId: context.id } 
            }));
          }
        } else {
          // 4. If no differences, the props are in sync with localStorage. Mark as initialized!
          isInitializedRef.current = true;
        }
      } catch (e) {
        console.error("Error parsing/syncing motion state in sync:", e);
        isInitializedRef.current = true; // Fallback to avoid getting stuck
      }
    }
  }, [
    totalStagger,
    p,
    yOffset,
    duration,
    easePreset,
    x1,
    y1,
    x2,
    y2,
    enableConfirm,
    confirmInitialScale,
    confirmDelay,
    confirmDuration,
    enableTitleFade,
    titleFadeDuration,
    descriptionDuration,
    descriptionYOffset,
    actionsDuration,
    actionsYOffset,
    statsDuration,
    statsYOffset,
    context.id,
  ]);

  // Listen to sync event from other active stories
  // By using argsRef, we only register this event listener ONCE on mount or when id/updateArgs changes,
  // preventing memory leaks and event listener thrashing.
  useEffect(() => {
    const handleSyncEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail._senderId === context.id) return;

        const updates: any = {};
        let needsUpdate = false;
        
        Object.keys(customEvent.detail).forEach((key) => {
          if (key === '_senderId' || key === 'focusSection') return;
          if (customEvent.detail[key] !== undefined && customEvent.detail[key] !== argsRef.current[key]) {
            updates[key] = customEvent.detail[key];
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          // Force isInitializedRef to stay true during sync events so we don't think it's a mount load
          isInitializedRef.current = true;
          updateArgs(updates);
        }
      }
    };

    window.addEventListener('bdc_motion_sync_event', handleSyncEvent);
    return () => {
      window.removeEventListener('bdc_motion_sync_event', handleSyncEvent);
    };
  }, [context.id, updateArgs]);

  return <Story />;
};
/* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

// Custom dynamic renderer that maps the ease dropdown presets to Framer Motion cubic-beziers
export const HeroRender = (args: StorybookHeroProps) => {
  let computedEase: [number, number, number, number] = [0.18, 1, 0.32, 1];

  if (args.easePreset && args.easePreset.startsWith('Apple Keynote')) {
    computedEase = [0.18, 1, 0.32, 1];
  } else if (args.easePreset && args.easePreset.startsWith('Out Expo')) {
    computedEase = [0.16, 1, 0.3, 1];
  } else if (args.easePreset && args.easePreset.startsWith('Back Out')) {
    computedEase = [0.34, 1.56, 0.64, 1];
  } else if (args.easePreset && args.easePreset.startsWith('Classic Ease-in-out')) {
    computedEase = [0.42, 0, 0.58, 1];
  } else if (args.easePreset === 'Custom Cubic Bezier') {
    computedEase = [args.x1, args.y1, args.x2, args.y2];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { easePreset, x1, y1, x2, y2, ...heroProps } = args;

  return <Hero {...heroProps} ease={computedEase} />;
};

export const commonArgTypes: ArgTypes<StorybookHeroProps> = {
  focusSection: {
    control: { type: 'select' },
    options: ['all', 'title', 'description', 'actions', 'stats'],
    description: 'Phân cảnh/Thành phần được hiển thị tập trung (cô lập và ẩn các phần còn lại)',
    table: {
      category: '🛠️ Setup & Layout',
    }
  },
  totalStagger: {
    control: { type: 'range', min: 0.1, max: 2.5, step: 0.05 },
    description: 'Tổng thời gian trễ stagger toàn cục của chuỗi tiêu đề (giây)',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  p: {
    control: { type: 'range', min: 1.0, max: 5.0, step: 0.1 },
    description: 'Số mũ phi tuyến bậc p của S-Curve (p = 1.0 là tuyến tính, p = 3.0 là cubic S-curve chuẩn)',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  yOffset: {
    control: { type: 'range', min: 0, max: 150, step: 2 },
    description: 'Độ nâng thẳng đứng của chữ cái tiêu đề từ dưới lên (pixel)',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  duration: {
    control: { type: 'range', min: 0.1, max: 2.0, step: 0.05 },
    description: 'Thời lượng chuyển động của mỗi ký tự tiêu đề riêng lẻ (giây)',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  easePreset: {
    control: { type: 'select' },
    options: [
      'Apple Keynote [0.18, 1, 0.32, 1]',
      'Out Expo (Smooth) [0.16, 1, 0.3, 1]',
      'Back Out (Snappy Pop) [0.34, 1.56, 0.64, 1]',
      'Classic Ease-in-out [0.42, 0, 0.58, 1]',
      'Custom Cubic Bezier'
    ],
    description: 'Đường cong gia tốc (Easing Curve) được thiết lập sẵn cho mỗi chữ cái',
    table: {
      category: '📈 Title Easing Curve',
    }
  },
  x1: {
    control: { type: 'range', min: 0, max: 1, step: 0.02 },
    description: 'Tọa độ x1 của Custom Cubic Bezier',
    table: {
      category: '📈 Title Easing Curve',
      subcategory: 'Custom Handles',
    }
  },
  y1: {
    control: { type: 'range', min: -0.5, max: 2.0, step: 0.02 },
    description: 'Tọa độ y1 của Custom Cubic Bezier',
    table: {
      category: '📈 Title Easing Curve',
      subcategory: 'Custom Handles',
    }
  },
  x2: {
    control: { type: 'range', min: 0, max: 1, step: 0.02 },
    description: 'Tọa độ x2 của Custom Cubic Bezier',
    table: {
      category: '📈 Title Easing Curve',
      subcategory: 'Custom Handles',
    }
  },
  y2: {
    control: { type: 'range', min: -0.5, max: 2.0, step: 0.02 },
    description: 'Tọa độ y2 của Custom Cubic Bezier',
    table: {
      category: '📈 Title Easing Curve',
      subcategory: 'Custom Handles',
    }
  },
  enableConfirm: {
    control: { type: 'boolean' },
    description: 'Bật/Tắt hiệu ứng confirm (phóng to nảy nhẹ) sau khi hoàn thành stagger',
    table: {
      category: '✨ Title Zoom & Confirm',
    }
  },
  confirmInitialScale: {
    control: { type: 'range', min: 0.8, max: 1.0, step: 0.01 },
    description: 'Tỷ lệ thu nhỏ ban đầu của tiêu đề (scale lúc bắt đầu)',
    table: {
      category: '✨ Title Zoom & Confirm',
    }
  },
  confirmDelay: {
    control: { type: 'range', min: 0.0, max: 2.5, step: 0.05 },
    description: 'Thời gian trễ trước khi kích hoạt hiệu ứng confirm (giây)',
    table: {
      category: '✨ Title Zoom & Confirm',
    }
  },
  confirmDuration: {
    control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
    description: 'Thời lượng chạy của hiệu ứng confirm (giây)',
    table: {
      category: '✨ Title Zoom & Confirm',
    }
  },
  enableTitleFade: {
    control: { type: 'boolean' },
    description: 'Bật/Tắt hiệu ứng mờ tỏ (fade-in) của tiêu đề "Big Data Club". Nếu tắt, chữ sẽ chỉ trượt/phóng to dạng khối đặc.',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  titleFadeDuration: {
    control: { type: 'range', min: 0.05, max: 2.0, step: 0.05 },
    description: 'Thời lượng chạy hoạt ảnh mờ tỏ (fade-in) riêng biệt của chữ cái tiêu đề (giây)',
    table: {
      category: '🔤 Title Stagger Motion',
    }
  },
  descriptionDuration: {
    control: { type: 'range', min: 0.1, max: 2.0, step: 0.05 },
    description: 'Thời lượng chạy hoạt ảnh mô tả (giây)',
    table: {
      category: '📝 Description Motion',
    }
  },
  descriptionYOffset: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: 'Khoảng cách trượt thẳng đứng từ dưới lên của mô tả (px)',
    table: {
      category: '📝 Description Motion',
    }
  },
  actionsDuration: {
    control: { type: 'range', min: 0.1, max: 2.0, step: 0.05 },
    description: 'Thời lượng chạy hoạt ảnh các nút tương tác (giây)',
    table: {
      category: '⚡ Actions Motion',
    }
  },
  actionsYOffset: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: 'Khoảng cách trượt thẳng đứng từ dưới lên của nút tương tác (px)',
    table: {
      category: '⚡ Actions Motion',
    }
  },
  statsDuration: {
    control: { type: 'range', min: 0.1, max: 2.0, step: 0.05 },
    description: 'Thời lượng chạy hoạt ảnh các thẻ số liệu thống kê (giây)',
    table: {
      category: '📊 Stats Cards Motion',
    }
  },
  statsYOffset: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: 'Khoảng cách trượt thẳng đứng từ dưới lên của các thẻ số liệu (px)',
    table: {
      category: '📊 Stats Cards Motion',
    }
  },
};

export const commonArgs = {
  focusSection: 'all' as const,
  totalStagger: 0.55,
  p: 2.0,
  yOffset: 40,
  duration: 0.35,
  easePreset: 'Custom Cubic Bezier',
  x1: 0.1,
  y1: 1.0,
  x2: 0.5,
  y2: 1.4,
  enableConfirm: true,
  confirmInitialScale: 0.85,
  confirmDelay: 1,
  confirmDuration: 0.35,
  enableTitleFade: true,
  titleFadeDuration: 0.25,
  descriptionDuration: 0.6,
  descriptionYOffset: 15,
  actionsDuration: 0.6,
  actionsYOffset: 15,
  statsDuration: 0.6,
  statsYOffset: 15,
};
