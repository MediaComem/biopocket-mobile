# `bip-menu-item-icon` component

This component extends the `bip-icon` component by displaying the icon on a rounded background. It's designed to be used in `bip-menu-item` component, but can be included anywhere.

## Attributes

| Name       | Type     | Details                                                                                                                                                        |
|:---        | :---     | :---                                                                                                                                                           |
| `name`     | `string` | The name of the icon that the component should display. Must be one of the available [biopocket icons][bip-icons].                                             |
| `color`    | `string` | _(Optional)_ The name of the color to apply to the icon. Must be one of the available [colors][bip-colors]. Defaults to the `'light'` color.                   |
| `bg-color` | `string` | _(Optional)_ The name of the background color to apply to the component. Must be one of the available [colors][bip-colors]. Defaults to the `'primary'` color. |

## Usage example

```html
<any-tag>
  ...
  <bip-menu-item-icon name="user" color="warning" bg-color="seabed"></bip-menu-item-icon>
  ...
</any-tag>
```

[bip-icons]: ../../DEVELOPMENT.md#icons
[bip-colors]: ../../DEVELOPMENT.md#colors
