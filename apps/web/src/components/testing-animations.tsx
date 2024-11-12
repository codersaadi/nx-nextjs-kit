import { AnimatedContainer, BlurTitle, FadeIn } from '@org/shared';
import React from 'react';
import { ScrollHighlight } from '@org/shared/components/animations/scroll-highlight';
import { TypeWriter } from '@org/shared/components/animations/type-writer';
import { AnimatedSearch } from '@org/shared';

export default function TestingAnimations() {
  return (
    <div className="top-16 h-[200vh] relative">
      <BlurTitle text="Welcome" />

      <BlurTitle
        text="Hello World"
        size="xl"
        color="text-blue-500"
        blurColor="rgba(59, 130, 246, 0.3)"
        weight="semibold"
        delay={0.2}
        threshold={0.7} // Trigger when 70% of element is visible
        className="my-8"
      />

      <div className="space-y-4">
        <BlurTitle once={false} text="First Line" delay={0} />
        <BlurTitle once={false} text="Second Line" delay={0.2} />
        <BlurTitle once={false} text="Third Line" delay={0.4} />
      </div>

      <FadeIn direction="up" delay={0.2}>
        <h1>Welcome to our site</h1>
      </FadeIn>
      {/* 
<SlideReveal direction="left" bgColor="bg-blue-500">
  <h2 className="text-white">Amazing Content</h2>
</SlideReveal> */}

      <TypeWriter
        text={['Hello!', 'Welcome to our site', 'Explore more...']}
        repeat={true}
        speed={70}
      />

      <FadeIn>
        <div className="space-y-4">
          <TypeWriter text="Welcome to our platform" />
          <ScrollHighlight>
            <p>Discover amazing features</p>
          </ScrollHighlight>
        </div>
      </FadeIn>

      <ScrollHighlight once={false} highlightHeight="md" delay={0.2}>
        <h2>This will highlight every time it enters viewport</h2>
      </ScrollHighlight>

      <TypeWriter
        text={['First', 'Second', 'Third']}
        once={false}
        speed={70}
        cursor={true}
      />

      <div className="space-y-8">
        <ScrollHighlight once={true}>
          <h1>One-time highlight</h1>
        </ScrollHighlight>

        <TypeWriter
          text="Repeating typewriter effect"
          once={false}
          speed={50}
        />
      </div>

      <AnimatedSearch
        onSearch={(value) => console.log('Searching for:', value)}
      />

      <div className="space-x-4">
        <AnimatedSearch variant="sm" />
        <AnimatedSearch variant="md" />
        <AnimatedSearch variant="lg" />
      </div>

      <AnimatedSearch
        className="bg-slate-100 dark:bg-slate-800"
        iconClassName="text-blue-500"
        containerClassName="my-4"
      />

      <AnimatedSearch iconPosition="right" />

      <AnimatedSearch defaultExpanded />

      <AnimatedSearch placeholder="Type to search products..." />

      <AnimatedContainer>
        <div className="p-4 bg-card">Content here</div>
      </AnimatedContainer>

      <AnimatedContainer animation={{ blur: 'md' }}>
        <div className="p-4">Blurred content</div>
      </AnimatedContainer>

      <AnimatedContainer
        animation={{
          slide: 'up',
          fade: true,
          duration: 500,
          delay: 200,
        }}
      >
        <div className="p-4">Sliding content</div>
      </AnimatedContainer>

      <AnimatedContainer
        animation={[
          { fade: true, delay: 0 },
          { slide: 'up', delay: 200 },
          { blur: 'sm', delay: 400 },
        ]}
      >
        <div className="p-4">Complex animation</div>
      </AnimatedContainer>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            id: 345,
            content: 'Card 1',
          },
          {
            id: 346,
            content: 'Card 2',
          },
        ].map((item, index) => (
          <AnimatedContainer
            key={item.id}
            animation={{
              fade: true,
              slide: 'up',
              delay: index * 100,
            }}
          >
            <div className="p-4 bg-card rounded-lg">{item.content}</div>
          </AnimatedContainer>
        ))}
      </div>

      <div className="space-y-6">
        <BlurTitle text="Welcome" />

        <AnimatedContainer
          animation={{
            blur: 'md',
            delay: 200,
          }}
        >
          <p className="text-lg text-muted-foreground">Subtitle text here...</p>
        </AnimatedContainer>

        <AnimatedContainer
          animation={{
            fade: true,
            slide: 'up',
            delay: 400,
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Cards or other content */}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
