---
title: 'Markdown Admonitions'
description: '这篇文章提供了如何在 Astro Citrus 中使用 Markdown 告诫功能的详细演示，展示了它以视觉上独特和可定制的格式突出重要信息、提示、警告和其他关键内容类型的能力'
publishDate: '25 Aug 2024'
seriesId: 'markdown-elements'
orderInSeries: 2
tags: ['markdown', 'admonitions']
draft: true
---

## What are admonitions

Admonitions (also known as “asides”) are useful for providing supportive and/or supplementary information related to your content.

## How to use them

To use admonitions in Astro Citrus, wrap your Markdown content in a pair of triple colons `:::`. The first pair should also include the type of admonition you want to use.

For example, with the following Markdown:

```md
:::note
Highlights information that users should take into account, even when skimming.
:::
```

Outputs:

:::note
Highlights information that users should take into account, even when skimming.
:::

## Admonition Types

The following admonitions are currently supported:

- `note`
- `tip`
- `important`
- `warning`
- `caution`

### Note

```md
:::note
Highlights information that users should take into account, even when skimming.
:::
```

:::note
Highlights information that users should take into account, even when skimming.
:::

### Tip

```md
:::tip
Optional information to help a user be more successful.
:::
```

:::tip
Optional information to help a user be more successful.
:::

### Important

```md
:::important
Crucial information necessary for users to succeed.
:::
```

:::important
Crucial information necessary for users to succeed.
:::

### Warning

```md
:::warning
Critical content demanding immediate user attention due to potential risks.
:::
```

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

### Caution

```md
:::caution
Negative potential consequences of an action.
:::
```

:::caution
Negative potential consequences of an action.
:::

## Customising the admonition title

You can customise the admonition title using the following markup:

```md
:::note[My custom title]
This is a note with a custom title.
:::
```

Outputs:

:::note[My custom title]
This is a note with a custom title.
:::
