import {Tree} from "./tree.js";

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
function randomArray() {
  let arr = [];
  let length = Math.floor(Math.random() * 100);
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (Math.random() * 1000)));
  }
  return arr;
}

let testTree = new Tree(randomArray());
prettyPrint(testTree.root);
console.log(testTree.isBalanced());
testTree.insert(100);
testTree.insert(1000);
testTree.insert(10000);
testTree.insert(99);
testTree.insert(98);
prettyPrint(testTree.root);
console.log(testTree.isBalanced());
testTree.rebalance();
prettyPrint(testTree.root);
console.log(testTree.isBalanced());