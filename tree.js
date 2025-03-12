export {Node, Tree};

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
class Tree {

  // is sorted is not true - use static method sortAndFillTree to sort arr before send it to 
  // another static method sortedArrayToBSTRecur.
  // if sorted is true - immediately use static method sortedArrayToBSTRecur.
  // if arguments wasn't provided at all - sortAndFillTree will assign new empty Node to the root
  constructor(arr, sorted) {
    this.root = (!sorted) ? Tree.sortAndFillTree(arr) : Tree.sortedArrayToBSTRecur(arr);
  }

  // simple sort and remove duplicates. 
  static sortAndFillTree(arr) {
    if (!arr) return new Node(null);
    const newArr = arr.sort((a, b) => a - b);
    const finalArr = [];

    // Removing duplicates implemented by checking if item at the next index in the sorted arr (newArr)
    // is equal to item at the current index, if it is - just ignore that item, otherwise - push item to
    // the finalArr. (in a sorted array every equal items are placed one after the other. So if next item is not
    // equal to the current item, then current item is the last or only item with that value and we can push it in
    // the final array) 
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i] !== newArr[i+1]) {
        finalArr.push(newArr[i]);
      }
    }
    return Tree.sortedArrayToBSTRecur(finalArr);
  }
  // simple BST recursive function
  static sortedArrayToBSTRecur(arr, start = 0, end = arr.length - 1) {
    if (start > end) return null;
  
    // Find the middle element
    let mid = start + Math.floor((end - start) / 2);
  
    // Create root node
    let root = new Node(arr[mid]);
    
    // Create left subtree
    root.left = Tree.sortedArrayToBSTRecur(arr, start, mid - 1);
  
    // Create right subtree
    root.right = Tree.sortedArrayToBSTRecur(arr, mid + 1, end);
  
    return root;
  }
  // insert new Node to the tree with given data
  insert(data) {
    let node = this.root;
    // if root node doesn't have any data - update it's data with given data
    if (!node.data) {
      this.root.data = data;
      return;
    }
    while (node !== null) {
      // check for duplicates
      if (data === node.data) return;
      // compare given data with node.data and traverse according to tree rules
      // if the next subtree is equal to null - assign new Node with given data on the place of null
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
  // delete Node with given data
  delete(data) {
    let current = this.search(data);
    if (current === null) return;
    // if node with given data doesn't have any children - delete that node from parents refs.
    if (current.nodeChildren === 0) {
      (current.parent.left !== null && current.parent.left.data === data) 
      ? current.parent.left = null 
      : current.parent.right = null;
      return;
    }
    // if node with given data has only one child - simply put that child node at the place of node that should be deleted
    if (current.nodeChildren === 1) {
      let newNode = (current.node.left !== null) 
      ? current.node.left 
      : current.node.right;
      (current.node === current.parent.left) 
      ? current.parent.left = newNode
      : current.parent.right = newNode;
    } else {
    // if node with given data has two children - find a suitable candidate to take it's place
    // by searching for a lowest node in the right subtree of node that should be deleted
    // (current node > go to the right subtree > in that right subtree go to the left subtree until find the end)
      let parent = null;
      let newNode = current.node.right;
      while (newNode.left !== null) {
        parent = newNode;
        newNode = newNode.left;
      }
      if (parent !== null) {
        current.node.data = newNode.data;
        // if the lowest node has right subtree as its child - it will be appended to its parent left subtree
        // because values of that subtree is still lower than data of that parent
      } else {
        // if the lowest node is the first node in the right subtree of the current node then
        // assign data from lowest node to the current node, and assign right subtree of the lowest node
        // as right subtree of the current node.
        current.node.data = newNode.data;
        current.node.right = newNode.right;
      }
    }
  }
  // search the given data and return object with information about node with that data, its parent, amount of children and depth(line 211)
  search(data) {
    let node = this.root;
    let depth = 1;
    // check amount of children of given node
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
    // traverse until find given data
    while (node !== null) {
      // increase depth with each iteration
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
      // traverse according to comparison between data and node.data
      (data < node.data) ? node = node.left : node = node.right;
    }
    return null;
  }
  // traverse in levelOrder and call callback on each node.
  // levelOrder traversal is implemented with simple queue(first-in-first-out).
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
  // simple recursive preOrder traversal and call a callback to each node
  preOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    callback(node);
    if (node.left) this.preOrder(callback, node.left);
    if (node.right) this.preOrder(callback, node.right);
  }
  // as above, but inOrder traversal
  inOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    if (node.left) this.inOrder(callback, node.left);
    callback(node);
    if (node.right) this.inOrder(callback, node.right);
  }
  // as above, but postOrder traversal
  postOrder(callback, node = this.root) {
    if (!callback || typeof callback !== "function") throw new Error("no valid callback is provided");
    if (node.left) this.postOrder(callback, node.left);
    if (node.right) this.postOrder(callback, node.right);
    callback(node);
  }
  // recursive method that is checking how many steps until the end of deepest tree from the given node.
  height(node) {
    let data = this.search(node).node;
    const findHeight = function(node) {
      let left = 0;
      let right = 0;
      if (node.left) left += findHeight(node.left) + 1;
      if (node.right) right += findHeight(node.right) + 1;
      if (!node.left && !node.right) {
        return 1;
      }
      if (left >= right) return left;
      return right;
    }
    return findHeight(data);
  }
  // use search method on given node to get the info of how deep is given node nested in the tree 
  depth(node) {
    return this.search(node).depth;
  }
  // check if a tree is balanced (balanced tree is a tree that have difference in subtrees depth no more than 1)
  isBalanced() {
    const findHeight = function(node) {
      let obj = {
        left: 0,
        right: 0,
      }
      if (node.left) {
        let tempObj = findHeight(node.left);
        if (tempObj === false) return false;
        (tempObj.left >= tempObj.right) 
        ? obj.left += tempObj.left + 1
        : obj.left += tempObj.right + 1; 
      }
      if (node.right) {
        let tempObj = findHeight(node.right);
        if (tempObj === false) return false;
        (tempObj.left >= tempObj.right) 
        ? obj.right += tempObj.left + 1
        : obj.right += tempObj.right + 1; 
      }
      if (!node.left && !node.right) {
        return obj;
      }
      if (obj.left > obj.right + 1 || obj.right > obj.left + 1) return false;
      return obj;
    }
    let result = findHeight(this.root);
    if (result === false) return false;
    if (result.left > (result.right + 1) 
    || result.right > (result.left + 1)) {
        return false;
    } else return true;
  }
  // rebalance a tree by recreating a tree completely.
  // inOrder method traverse from lowest to highest value
  // so arr will be immediately sorted
  rebalance() {
    let arr = []; 
    this.inOrder((node) => arr.push(node.data));
    this.root = Tree.sortedArrayToBSTRecur(arr, 0, arr.length - 1)
    return arr;
  }
}