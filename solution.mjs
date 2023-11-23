import jsonData from "./data.json" assert { type: "json" };

let nodeResult = [];

function processArray(key, node) {
  const nodeItem = {};

  node.forEach((item) => {
    if (typeof item === "string" && !Object.keys(nodeItem).length) {
      if (key === "xmr") {
        nodeItem.store = node[0];
        nodeItem.address = node[1];
        nodeItem.viewkey = node[2];
      } else if (["btc", "ltc", "bch"].includes(key)) {
        nodeItem.store = node[0];
        nodeItem.xpub = node[1];
      } else {
        nodeItem.store = node[0];
        nodeItem.address = node[1];
        if (node[2]) nodeItem.name = node[2];
      }

      nodeResult.push(nodeItem);
    } else if (item instanceof Object) {
      // Do recursion, if the node is an object
      processNode(key, item);
    }
  });
}

function processNode(key, node) {
  if (Array.isArray(node)) {
    processArray(key, node);
  } else if (!Array.isArray(node) && node instanceof Object) {
    // Do recursion, if the node is an object but not array
    processNode(key, node);
  }

  // Return processed node result
  return nodeResult;
}

function convertJsonData(inputData) {
  const result = {};

  Object.keys(inputData).forEach((key) => {
    // Process data node
    result[key] = processNode(key, inputData[key]);

    // Reset node result
    nodeResult = [];
  });

  return result;
}

// Convert imported json object of arrays
const convertedData = convertJsonData(jsonData);
console.log(JSON.stringify(convertedData, null, 2));
