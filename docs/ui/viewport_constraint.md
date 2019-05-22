## ViewportConstraint

**Extends React.Component**

-   **See: sdk.viewport**

ViewportConstraint - when mounted, applies constraints to the viewport.

### Examples

```javascript
<UI.ViewportConstraint minSize={{width: 400}} />
```

```javascript
<UI.ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
    <div>I need a max fullscreen size!</div>
</UI.ViewportConstraint>
```
