export const defaultComponents = {
  '#text': (props) => props.node.textContent,
  '#comment': () => null
}

function attrsToObject(attrs) {
  return Object.fromEntries([...attrs].map((attr) => [attr.name, attr.value]))
}

export const FallbackComponent = ({ node, children }) => {
  const props = attrsToObject(node.attributes ?? [])
  const Tag = node.nodeName.toLowerCase()
  return <Tag {...props}>{children}</Tag>
}