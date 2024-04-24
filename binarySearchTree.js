class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    if (!array.length) return null;
    array.sort((a, b) => a - b); // Sorting
    array = [...new Set(array)]; // Uses set() to remove duplicates, ... spreads back into array
    const middleIndex = Math.floor(array.length / 2);
    const root = new Node(array[middleIndex]);
    root.left = this.buildTree(array.slice(0, middleIndex));
    root.right = this.buildTree(array.slice(middleIndex + 1)); // no second argument needed

    return root;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(value) {
    this.root = this.insertRecursive(this.root, value);
  }

  insertRecursive(currentNode, value) {
    if (currentNode === null) {
      return new Node(value);
    }
    if (value < currentNode.data) {
      currentNode.left = this.insertRecursive(currentNode.left, value);
    } else {
      currentNode.right = this.insertRecursive(currentNode.right, value);
    }
    return currentNode;
  }

  delete(value) {
    this.root = this.deleteRecursive(this.root, value);
  }

  deleteRecursive(currentNode, value) {
    if (currentNode === null) {
      return null;
    }
    if (value < currentNode.data) {
      currentNode.left = this.deleteRecursive(currentNode.left, value);
    } else if (value > currentNode.data) {
      currentNode.right = this.deleteRecursive(currentNode.right, value);
    } else {
      // Node with only one or no child
      if (currentNode.left === null) {
        return currentNode.right;
      } else if (currentNode.right === null) {
        return currentNode.left;
      }

      // Node with 2 children - Get inorder successor (smallest in the right subtree)
      currentNode.data = this.minValue(currentNode.right);

      // Delete inorder successor
      currentNode.right = this.deleteRecursive(
        currentNode.right,
        currentNode.data
      );
    }
    return currentNode;
  }

  minValue(node) {
    let minv = node.data;
    while (node.left != null) {
      minv = node.left.data;
      node = node.left;
    }
    return minv;
  }

  find(value) {
    return this.findRecursive(this.root, value);
  }

  findRecursive(currentNode, value) {
    if (currentNode === null) {
      return null;
    }
    if (value === currentNode.data) {
      return currentNode;
    }
    if (value < currentNode.data) {
      return this.findRecursive(currentNode.left, value);
    } else {
      return this.findRecursive(currentNode.right, value);
    }
  }

  levelOrder(callback) {
    if (!this.root) return [];
    const queue = [this.root];
    const result = [];

    while (queue.length) {
      const currentNode = queue.shift(); // Dequeue the front item
      if (callback) {
        callback(currentNode);
      } else {
        result.push(currentNode.data); // Collect data if no callback
      }

      if (currentNode.left) {
        queue.push(currentNode.left); // Enqueue left child
      }
      if (currentNode.right) {
        queue.push(currentNode.right); // Enqueue right child
      }
    }
    return result;
  }

  inOrder(callback, node = this.root, result = []) {
    if (!node) return result;
    this.inOrder(callback, node.left, result);
    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }
    this.inOrder(callback, node.right, result);
    return result;
  }

  preOrder(callback, node = this.root, result = []) {
    if (!node) return result;
    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }
    this.preOrder(callback, node.left, result);
    this.preOrder(callback, node.right, result);
    return result;
  }

  postOrder(callback, node = this.root, result = []) {
    if (!node) return result;
    this.postOrder(callback, node.left, result);
    this.postOrder(callback, node.right, result);
    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }
    return result;
  }

  height(node) {
    if (node === null) {
      return -1; // A null node has height -1, so a leaf node has height 0
    }
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  depth(node, currentNode = this.root, currentDepth = 0) {
    if (currentNode === null) {
      return -1; // Node not found in the tree, return -1
    }
    if (currentNode === node) {
      return currentDepth; // Node found, return the current depth
    }
    // Search in left subtree
    const leftSearch = this.depth(node, currentNode.left, currentDepth + 1);
    if (leftSearch !== -1) {
      return leftSearch; // Node found in left subtree
    }
    return this.depth(node, currentNode.right, currentDepth + 1); // Continue to right subtree
  }

  isBalanced(node = this.root) {
    if (node === null) {
      return true; // A null tree is considered balanced.
    }
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    // Check if current node is balanced and recursively check left and right subtrees.
    return (
      // We are interested in the magnitude of the difference between the heights
      // of the left and right subtrees, rather than the direction of that difference
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  rebalance() {
    const elements = this.inOrder(); // Retrieve elements in sorted order
    this.root = this.buildTree(elements); // Rebuild the tree to be balanced
  }

  inOrder(node = this.root, result = []) {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.data);
    this.inOrder(node.right, result);
    return result;
  }
}

function generateRandomArray(size, max) {
  const randomNumbers = [];
  for (let i = 0; i < size; i++) {
    randomNumbers.push(Math.floor(Math.random() * max));
  }
  return randomNumbers;
}

const randomArray = generateRandomArray(20, 100);
const tree = new Tree(randomArray);

console.log("Initial random tree:");
tree.prettyPrint();

console.log("Is the tree balanced?");
console.log(tree.isBalanced());

console.log("Level order traversal:");
console.log(tree.levelOrder());

console.log("Pre-order traversal:");
console.log(tree.preOrder());

console.log("Post-order traversal:");
console.log(tree.postOrder());

console.log("In-order traversal:");
console.log(tree.inOrder());

// Unbalancing the tree
tree.insert(101);
tree.insert(102);
tree.insert(103);
tree.insert(104);

console.log("After adding elements >100, is the tree balanced?");
console.log(tree.isBalanced());

// Rebalancing the tree
tree.rebalance();

console.log("After rebalancing, is the tree balanced?");
console.log(tree.isBalanced());

console.log("Final tree state:");
tree.prettyPrint();

console.log("Level order traversal:");
console.log(tree.levelOrder());

console.log("Pre-order traversal:");
console.log(tree.preOrder());

console.log("Post-order traversal:");
console.log(tree.postOrder());

console.log("In-order traversal:");
console.log(tree.inOrder());
