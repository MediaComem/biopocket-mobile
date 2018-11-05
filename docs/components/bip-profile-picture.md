# `bip-profile-picture` component

This component displays an image inside a circle with two borders (one white and one gradient), as defined in the mockups of the BioPocket app, like this:

![profile picture example][profilepicture]

It should be used primarily to display a user's profile picture. It's used in the `bip-menu-header` component.

> This component should behave very much like an `img` tag.

## Attributes

| Name | Type | Details |
|:--- | :--- | :--- |
| `src` | `string` | _(Optional)_ An URL that points to the image that the component should display. If not provided, the BioPocket `user` icon will be used instead. |

## Usage example

```html
<any-tag>
  ...
  <bip-profile-picture src="https://example.com/picture123.png"></bip-profile-picture>
  ...
</any-tag>
```

[profilepicture]: ../img/profile-picture-example.png
