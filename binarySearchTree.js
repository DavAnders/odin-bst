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
}
