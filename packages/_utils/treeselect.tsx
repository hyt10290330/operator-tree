import { Icon } from 'ant-design-vue'

interface TreeSelectNode {
  value: string
  label: string
}

export function getTitle(
  openIcon: string,
  closeIcon: string,
  props: TreeSelectNode,
  isExpandeKeys: (value: string) => boolean
) {
  return function(h: any) {
    const iconProps = {
      type: isExpandeKeys(props.value) ? openIcon : closeIcon,
    }
    return (
      <span style="padding: 0 8px">
        <Icon props={iconProps} />
        <span style="margin-left: 8px">{props.label}</span>
      </span>
    )
  }
}
