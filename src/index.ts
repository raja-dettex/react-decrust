interface VNode { 
    type : string,
    props?: {[key: string] : any},
    children : (VNode | string)[]
}

// create the vnode
function createElement(type: string, props: any, ...children: (VNode | string) []) : VNode { 
    return { type, props,children}
}

// vnode is a in memory representation of actuals nodes i.e is a reald dom , which might have multiple child vnode, 
// the parent vnode actually represents the virtual dom tree

function render(vnode: VNode | string) : Node { 
    if (typeof vnode === "string") { 
        return document.createTextNode(vnode);
    }

    const element = document.createElement(vnode.type);
    if(vnode.props) { 
        for(const [key, value] of  Object.entries(vnode.props)) { 
            if(key.startsWith("on") && typeof value === "function") { 
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else { 
                element.setAttribute(key, value);
            }
        }
    }
    if(Array.isArray(vnode.children)) { 
        vnode.children.forEach(child => { 
            element.appendChild(render(child));
        })
    }
    return element;
}


function diff(oldVNode: VNode | string, newVNode: VNode | string): boolean {
    if (typeof oldVNode !== typeof newVNode) {
        return true; // If node types are different, re-render
    }
    
    if (typeof oldVNode === "string" && typeof newVNode === "string") {
        return oldVNode !== newVNode; // If text changed, update it
    } else if(typeof oldVNode !== "string" && typeof newVNode !== "string") {
    
        if (oldVNode.type !== newVNode.type) {
            return true; // If elements are different, replace the whole node
        }

        // Check attributes (props)
        const oldProps = oldVNode.props || {};
        const newProps = newVNode.props || {};

        const oldKeys = Object.keys(oldProps);
        const newKeys = Object.keys(newProps);

        if (oldKeys.length !== newKeys.length) return true;

        for (const key of newKeys) {
            if (oldProps[key] !== newProps[key]) return true;
        }
    }
    return false;
}

function patch(parent: Node, oldVNode: VNode | string, newVNode: VNode | string, index = 0) {
    if (!oldVNode) {
        parent.appendChild(render(newVNode)); // If new node, add it
    } else if (!newVNode) {
        parent.removeChild(parent.childNodes[index]); // If old node removed, delete it
    } else if (diff(oldVNode, newVNode)) {
        parent.replaceChild(render(newVNode), parent.childNodes[index]); // Replace changed node
    } else if (typeof newVNode !== "string" && typeof oldVNode !== "string") {
        // Update attributes instead of replacing nodes
        updateAttributes(parent.childNodes[index] as HTMLElement, oldVNode.props, newVNode.props);

        // Compare children recursively
        const oldChildren = Array.isArray(oldVNode.children) ? oldVNode.children : [oldVNode.children];
        const newChildren = Array.isArray(newVNode.children) ? newVNode.children : [newVNode.children];

        const max = Math.max(oldChildren.length, newChildren.length);
        for (let i = 0; i < max; i++) {
            const oldChild = oldChildren[i] || null;  // Default to null if undefined
            const newChild = newChildren[i] || null;  // Default to null if undefined

            if (!oldChild) {
                // If there's no oldChild but a newChild exists, append it
                parent.appendChild(render(newChild as VNode));
            } else if (!newChild) {
                // If there's an oldChild but no newChild, remove it
                parent.removeChild(parent.childNodes[i]);
            } else {
                // Otherwise, update the existing child
                patch(parent.childNodes[i], oldChild as VNode, newChild as VNode, i);
            }
        }
    }
}

function updateAttributes(element: HTMLElement, oldProps: any, newProps: any) {
    const allProps = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);

    allProps.forEach(prop => {
        const oldValue = oldProps?.[prop];
        const newValue = newProps?.[prop];

        if (oldValue !== newValue) {
            if (newValue === null || newValue === undefined) {
                element.removeAttribute(prop);
            } else {
                element.setAttribute(prop, newValue);
            }
        }
    });
}




// next create vNOde and render it
const node = createElement("div", {"id" : "header"}, 
    createElement("h1", {}, "hello this vDOM"),
    createElement("button", {"onClick" : () => {alert("here");}}, "Click me")
)

document.body.appendChild(render(node))

patch(render(node), "hello", "hello", 0) 