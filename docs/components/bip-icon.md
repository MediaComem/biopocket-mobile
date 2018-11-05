# `bip-icon` component

This component should be used whenever one wants to display a BioPocket icon that is included in the icon set.

> It behave very much like an `ion-icon` component.

## Attributes

| Name    | Type     | Details                                                                                                                                                            |
|:---     | :---     | :---                                                                                                                                                               |
| `name`  | `string` | The name of the icon that the component should display. Must be one of the available [biopocket icons][bip-icons].                                                 |
| `color` | `string` | _(Optional)_ The name of the color to apply to the icon. Must be one of the available [colors][bip-colors]. Defaults to the color of the closest parent in the DOM.|

## Usage example

```html
<any-tag>
  ...
  <bip-icon name="camera" color="lagoon"></bip-icon>
  ...
</any-tag>
```

[bip-icons]: ../../DEVELOPMENT.md#icons
[bip-colors]: ../../DEVELOPMENT.md#colors
