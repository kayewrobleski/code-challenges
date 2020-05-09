const fs = require('fs');
const readline = require('readline');
const filename = process.argv[2];

function findNeighbors(tree, value) {
    let neighbors = [];
    for (let i = 0; i < tree.length; i++) {
        let edge = tree[i];
        if (edge[0] == value) {
            neighbors.push(edge[1]);
        } else if (edge[1] == value) {
            neighbors.push(edge[0]);
        }
    }
    return neighbors;
}

function breadthFirstSearchAtDistance(tree, sourceNode, distance) {

    let nodes = [...new Set(tree.flat())];

    let queue = [];
    let visited = [];
    let levels = [];
    let nodesAtDistance = [];

    queue.push(sourceNode);
    visited.push(sourceNode);
  
    levels[nodes.indexOf(sourceNode)] = 0;

    while (queue.length > 0) {

        let currentNode = queue.shift();
        let level = levels[nodes.indexOf(currentNode)] + 1;
        if (level > distance) {
            break;
        }

        let neighbors = findNeighbors(tree, currentNode);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!visited.includes(neighbor)) {

                if (level == distance) {
                    nodesAtDistance.push(neighbor);
                }

                queue.push(neighbor);
                levels[nodes.indexOf(neighbor)] = level;
                visited.push(neighbor);
            }
            
        }

    }

    return nodesAtDistance;
}

function calculateQueries(edges, queries) {

    for (let i = 0; i < queries.length; i++) {
        let query = queries[i];
        // console.log("Query: ", query);
        let nodesA = breadthFirstSearchAtDistance(edges, query[0], query[1]);
        let nodesB = breadthFirstSearchAtDistance(edges, query[2], query[3]);

        // console.log("A: ", nodesA);
        // console.log("B: ", nodesB);

        let intersection = nodesA.filter(node => nodesB.includes(node));


        if (intersection.length > 0) {
            console.log(intersection[0])
        } else {
            console.log('-1');
        }
    }
}


function getResults(trees) {
    for (let i = 0; i < trees.length; i++) {
        let tree = trees[i];

        // console.log(tree);

        calculateQueries(tree.edges, tree.queries);
    }
}

function parseLine(lines) {
    let currentLine = lines.shift();
    return currentLine.split(' ').map(val => parseInt(val));
}

function parseTrees() {
    let trees = [];

    const data = fs.readFileSync(filename, { encoding:'utf8', flag:'r' });
    lines = data.split('\n');

    const treeCount = parseLine(lines);

    for (let i = 0; i < treeCount; i++) {

        let description = parseLine(lines);  
        let edgesCount = description[0];
        let queryCount = description[1];
        let edges = [];
        let queries = [];

        for (let j = 0; j < edgesCount-1; j++) {
            edges[j] = parseLine(lines);
        }

        for (let w = 0; w < queryCount; w++) {
            queries[w] = parseLine(lines);
        }

        trees.push({
            edges: edges,
            queries: queries
        })
    }

    return trees;
}

let trees = parseTrees();
getResults(trees);







