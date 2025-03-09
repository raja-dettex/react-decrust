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
    if(Array.isArray(vnode.children)) { 
        vnode.children.forEach(child => { 
            element.appendChild(render(child));
        })
    }
    return element;
}


function diff(oldvNode: VNode , newVNode: VNode) : boolean { 
    if(typeof oldvNode === "string" || typeof newVNode === "string") {
        return oldvNode.children !== newVNode.children;
    }
    if(oldvNode.type !== newVNode.type) {
        return true;
    }
    return false;
}

function patch(parent: Node, oldvNode: VNode, newVNode: VNode, index = 0) {
    if(!oldvNode) {
        parent.appendChild(render(newVNode));
    } else if(!newVNode) { 
        parent.removeChild(parent.childNodes[index]);
    } else if (diff(oldvNode, newVNode)) { 
        parent.replaceChild(render(newVNode), parent.childNodes[index]);
    } else if(Array.isArray(newVNode.children)) { 
        newVNode.children.forEach((child, i) => patch(parent.childNodes[index], oldvNode.children[i] as VNode, child as VNode, i ))
    }
}

// next create vNOde and render it
const node = createElement("div", {"id" : "header"}, 
    createElement("h1", {}, "hello this vDOM"),
    createElement("p", {}, "vDOM loads")
)

document.body.appendChild(render(node))