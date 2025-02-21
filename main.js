class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
class Tree {
  constructor(root) {
    this.root = root;
  }
  insert(data) {
    let node = this.root;
    while (node !== null) {
      if (data === node.data) return;
      if (data < node.data) {
        if (node.left === null) {
          node.left = new Node(data);
          return;
        }
        node = node.left;
      } else if (data > node.data) {
        if (node.right === null) {
          node.right = new Node(data);
          return;
        }
        node = node.right;
      }
    }
  }
  delete(data) {
    let current = this.search(data);
    if (current === null) return;
    if (current.nodeChildren === 0) {
      (current.parent.left !== null && current.parent.left.data === data) 
      ? current.parent.left = null 
      : current.parent.right = null;
      return;
    }
    if (current.nodeChildren === 1) {
      let newNode = (current.node.left !== null) 
      ? current.node.left 
      : current.node.right;
      (current.node === current.parent.left) 
      ? current.parent.left = newNode
      : current.parent.right = newNode;
    } else {
      let parent = null;
      let newNode = current.node.right;
      while (newNode.left !== null) {
        parent = newNode;
        newNode = newNode.left;
      }
      if (parent !== null) {
        current.node.data = newNode.data;
        parent.left = newNode.right;
      } else {
        current.node.data = newNode.data;
        current.node.right = newNode.right;
      }
    }
  }
  search(data) {
    let node = this.root;
    const childrenCheck = (node) => {
      let nodeChildren = 0;
      if (node.left !== null) nodeChildren++;
      if (node.right !== null) nodeChildren++;
      return nodeChildren;
    }
    if (data === node.data) {
      return {
        parent: null, 
        node: node, 
        nodeChildren: childrenCheck(node),
      }
    }
    while (node !== null) {
      if (node.left !== null && data === node.left.data) {
        return {
          parent: node, 
          node: node.left, 
          nodeChildren: childrenCheck(node.left),
        }
      }
      if (node.right !== null && data === node.right.data) {
        return {
          parent: node, 
          node: node.right, 
          nodeChildren: childrenCheck(node.right),
        }
      }
      (data < node.data) ? node = node.left : node = node.right;
    }
    return null;
  }
}

function sortedArrayToBSTRecur(arr, start, end) {
  if (start > end) return null;

  // Find the middle element
  let mid = start + Math.floor((end - start) / 2);

  // Create root node
  let root = new Node(arr[mid]);
  
  // Create left subtree
  root.left = sortedArrayToBSTRecur(arr, start, mid - 1);

  // Create right subtree
  root.right = sortedArrayToBSTRecur(arr, mid + 1, end);

  return root;
}

function sortAndToBST(arr) {
  const newArr = arr.sort((a, b) => a - b);
  const finalArr = [];
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i] !== newArr[i+1]) {
      finalArr.push(newArr[i]);
    }
  }
  return new Tree(sortedArrayToBSTRecur(finalArr, 0, finalArr.length - 1));
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};


let test = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 6];
let testRoot = sortAndToBST(test);
// testRoot.insert(6);
prettyPrint(testRoot.root);
// console.log(testRoot.search(324));
testRoot.delete(23);
prettyPrint(testRoot.root);
