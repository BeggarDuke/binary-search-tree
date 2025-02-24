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
    let depth = 1;
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
        depth: depth,
      }
    }
    while (node !== null) {
      depth++;
      if (node.left !== null && data === node.left.data) {
        return {
          parent: node, 
          node: node.left, 
          nodeChildren: childrenCheck(node.left),
          depth: depth,
        }
      }
      if (node.right !== null && data === node.right.data) {
        return {
          parent: node, 
          node: node.right, 
          nodeChildren: childrenCheck(node.right),
          depth: depth,
        }
      }
      (data < node.data) ? node = node.left : node = node.right;
    }
    return null;
  }
  levelOrder(callback) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    let q = [this.root];
    let current = 0;
    while (current < q.length) {
      let node = q[current];
      callback(node);
      if (node.left !== null) q.push(node.left);
      if (node.right !== null) q.push(node.right);
      current++;
    }
  }
  preOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    callback(node);
    if (node.left) this.preOrder(callback, node.left);
    if (node.right) this.preOrder(callback, node.right);
  }
  inOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    if (node.left) this.inOrder(callback, node.left);
    callback(node);
    if (node.right) this.inOrder(callback, node.right);
  }
  postOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    if (node.left) this.postOrder(callback, node.left);
    if (node.right) this.postOrder(callback, node.right);
    callback(node);
  }
  height(node) {
    let data = this.search(node).node;
    const findHeight = function(node) {
      let left = 0;
      let right = 0;
      if (node.left)left += findHeight(node.left) + 1;
      if (node.right)right += findHeight(node.right) + 1;
      if (!node.left && !node.right) {
        return 1;
      }
      if (left >= right) return left;
      return right;
    }
    return findHeight(data);
  }
  depth(node) {
    return this.search(node).depth;
  }
  isBalanced() {
    const findHeight = function(node) {
      let obj = {
        left: 0,
        right: 0,
      }
      if (node.left) {
        let tempObj = findHeight(node.left);
        (tempObj.left >= tempObj.right) 
        ? obj.left += tempObj.left + 1
        : obj.left += tempObj.right + 1; 
      }
      if (node.right) {
        let tempObj = findHeight(node.right);
        (tempObj.left >= tempObj.right) 
        ? obj.right += tempObj.left + 1
        : obj.right += tempObj.right + 1; 
      }
      if (!node.left && !node.right) {
        obj.left++;
        obj.right++;
        return obj;
      }
      return obj;
    }
    let result = findHeight(this.root);
    if (result.left > (result.right + 1) 
    || result.right > (result.left + 1)) {
        return false;
    } else return true;
  }
  rebalance() {
    let arr = []; 
    this.inOrder((node) => arr.push(node.data));
    this.root = sortedArrayToBSTRecur(arr, 0, arr.length - 1)
    return arr;
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


let test = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let testRoot = sortAndToBST(test);
testRoot.insert(6);
testRoot.insert(1337);
testRoot.insert(69);
testRoot.insert(420);
testRoot.insert(80813);
testRoot.insert(80083);
testRoot.insert(800813);
testRoot.insert(80013);
testRoot.insert(803);

// prettyPrint(testRoot.root);
// console.log(testRoot.search(324));
// testRoot.delete(23);
prettyPrint(testRoot.root);
// console.log(testRoot.height(8), testRoot.isBalanced(), testRoot.rebalance());
// let arr = [];
// testRoot.inOrder((node) => {
  // arr.push(node.data);
// });
// testRoot.levelOrder(1);
// console.log(arr);
console.log(testRoot.isBalanced());
testRoot.rebalance();
prettyPrint(testRoot.root);
console.log(testRoot.isBalanced());