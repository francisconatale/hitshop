---
name: react-composition-patterns
description: React composition patterns for scalable components. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on compound components, render props, context providers, or component architecture.
---

# React Composition Patterns

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals.

## When to Apply

- Refactoring components with many boolean props
- Building reusable component libraries
- Designing flexible component APIs
- Working with compound components or context providers

## Core Principles

1. **Composition over configuration** — Instead of adding props, let consumers compose
2. **Lift your state** — State in providers, not trapped in components
3. **Make state dependency-injectable** — Define generic interfaces
4. **Explicit variants** — Create ThreadComposer, EditComposer, not Composer with isThread

## Quick Reference

### 1. Avoid Boolean Props (CRITICAL)

**Don't add boolean props like `isThread`, `isEditing`.** Each boolean doubles possible states.

**Bad:**
```tsx
function Composer({ isThread, isEditing, isForwarding, ... }) {
  if (isThread) return <ThreadContent />
  if (isEditing) return <EditContent />
  // ...exponential complexity
}
```

**Good — explicit variants:**
```tsx
<ThreadComposer channelId="abc" />
<EditComposer messageId="xyz" />
```

### 2. Compound Components with Context

Structure complex components with shared context via compound components.

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
}

// Usage
<Composer.Provider state={state} actions={actions}>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</Composer.Provider>
```

### 3. Generic Context Interface

Define three-part interface: `state`, `actions`, `meta`.

```tsx
interface ComposerContextValue {
  state: { input: string; isSubmitting: boolean }
  actions: { update: () => void; submit: () => void }
  meta: { inputRef: React.RefObject<HTMLInputElement> }
}
```

### 4. Lift State to Providers

Move state into provider components. Sibling components outside Frame can still access state.

```tsx
function ForwardMessageProvider({ children }) {
  const [state, setState] = useState(initial)
  return (
    <Composer.Provider state={state} actions={{ update: setState, submit }}>
      {children}
    </Composer.Provider>
  )
}

// Button OUTSIDE Frame but INSIDE Provider can access submit
<ForwardMessageProvider>
  <Dialog>
    <Composer.Frame>...</Composer.Frame>
    <ForwardButton /> {/* Works! Uses actions.submit from provider */}
  </Dialog>
</ForwardMessageProvider>
```

### 5. Children Over Render Props

Prefer `children` for composition, not `renderX` props.

**Bad:**
```tsx
<Composer renderHeader={() => <Header />} renderFooter={() => <Footer />} />
```

**Good:**
```tsx
<Composer.Frame>
  <Composer.Header />
  <Composer.Footer />
</Composer.Frame>
```

## React 19 API Changes

> Skip if using React 18 or earlier.

- No `forwardRef` needed — use ref as regular prop
- Use `use(context)` instead of `useContext(context)`

```tsx
// React 19
function Input({ ref, ...props }) { return <input ref={ref} {...props} /> }
const value = use(MyContext)
```

## Key Insight

**The provider boundary is what matters—not visual nesting.** Components needing shared state don't have to be inside `Composer.Frame`. They just need to be within the provider.

## References

- https://react.dev
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/use
