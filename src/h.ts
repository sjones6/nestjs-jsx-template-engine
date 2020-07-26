function stringifyChildren(child: any): string {

  let stringifiedChild: string = typeof child === 'string' ? child : '';
  if (!stringifiedChild) {
    if (child instanceof String) {
      stringifiedChild = child.toString();
    }
    if (Array.isArray(child)) {
      stringifiedChild = child.join('')
    } else if (child && typeof child.toString === 'function') {
      // there's a value that exposes a `toString` coercion method
      stringifiedChild = child.toString();
    }
  
    // coerce a number of falsey varietes to a string, but exclude null,
    // which is the standard behavior of React's JSX engine
    if (!child && child !== null) {
      stringifiedChild = `${child}`;
    }
  }
  return stringifiedChild;
}

export const h = (tagName: Function|string, props?: object, ...children) => {
  if (typeof tagName === 'function') {
    return tagName({ ...props, children });
  }

  let stringifiedChildren: string = children.map(stringifyChildren).join('\n');
  let stringifiedProps: string = '';
  if (props) {
    stringifiedProps = Object.entries(props)
    .map(([key, value]) => {
      if (value && typeof value.toString === 'function') {
        return `${key}="${value.toString()}"`
      }
      return `${key}="${value}"`;
    })
    .join(' ')
  }

  return `<${tagName}${stringifiedProps ? ' ' + stringifiedProps : ''}>${stringifiedChildren}</${tagName}>`
}