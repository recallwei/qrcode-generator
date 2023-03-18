import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'

/**
 * Render icon.
 * @param icon Icon component
 */
const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

/**
 * Get router link node.
 * @param href Link
 * @param text Menu text
 */
const getRouterLinkNode = (href: string, text: string) => () => h(RouterLink, { to: href }, { default: () => text })

/**
 * Get outside link node.
 * @param href External link
 * @param text Menu text
 */
const getOutsideLinkNode = (href: string, text: string) => () =>
  h('a', { href, target: '_blank', rel: 'noopenner noreferrer' }, text)

export default { renderIcon, getOutsideLinkNode, getRouterLinkNode }
