// ======================================================
// AVL TREE VISUALIZER
// ======================================================

// ======================================================
// AVL NODE
// ======================================================

class Node {

    constructor(value) {

        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}


// ======================================================
// AVL TREE
// ======================================================

class AVLTree {

    constructor() {

        this.root = null;
        this.lastRotation = null;
        this.rotationNodes = [];
    }


    // ==================================================
    // HEIGHT
    // ==================================================

    getHeight(node) {

        return node === null
            ? 0
            : node.height;
    }


    // ==================================================
    // UPDATE HEIGHT
    // ==================================================

    updateHeight(node) {

        if (node === null) {
            return;
        }

        node.height =
            1 +
            Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );
    }


    // ==================================================
    // BALANCE FACTOR
    // ==================================================

    getBalanceFactor(node) {

        if (node === null) {
            return 0;
        }

        return (
            this.getHeight(node.left) -
            this.getHeight(node.right)
        );
    }


    // ==================================================
    // RIGHT ROTATION
    // ==================================================

    rightRotate(y) {

        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }


    // ==================================================
    // LEFT ROTATION
    // ==================================================

    leftRotate(x) {

        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }


    // ==================================================
    // INSERT
    // ==================================================

    insert(value) {

        this.lastRotation = null;
        this.rotationNodes = [];

        this.root =
            this.insertNode(
                this.root,
                value
            );
    }


    insertNode(node, value) {

        if (node === null) {

            return new Node(value);
        }


        // LEFT
        if (value < node.value) {

            node.left =
                this.insertNode(
                    node.left,
                    value
                );
        }


        // RIGHT
        else if (value > node.value) {

            node.right =
                this.insertNode(
                    node.right,
                    value
                );
        }


        // DUPLICATE
        else {

            return node;
        }


        this.updateHeight(node);


        const balance =
            this.getBalanceFactor(node);


        // ==================================================
        // LL
        // ==================================================

        if (
            balance > 1 &&
            value < node.left.value
        ) {

            this.lastRotation = "LL";
            this.rotationNodes = [
                node.value,
                node.left.value
            ];

            return this.rightRotate(node);
        }


        // ==================================================
        // RR
        // ==================================================

        if (
            balance < -1 &&
            value > node.right.value
        ) {

            this.lastRotation = "RR";
            this.rotationNodes = [
                node.value,
                node.right.value
            ];

            return this.leftRotate(node);
        }


        // ==================================================
        // LR
        // ==================================================

        if (
            balance > 1 &&
            value > node.left.value
        ) {

            this.lastRotation = "LR";

            this.rotationNodes = [
                node.value,
                node.left.value,
                value
            ];

            node.left =
                this.leftRotate(
                    node.left
                );

            return this.rightRotate(node);
        }


        // ==================================================
        // RL
        // ==================================================

        if (
            balance < -1 &&
            value < node.right.value
        ) {

            this.lastRotation = "RL";

            this.rotationNodes = [
                node.value,
                node.right.value,
                value
            ];

            node.right =
                this.rightRotate(
                    node.right
                );

            return this.leftRotate(node);
        }


        return node;
    }


    // ==================================================
    // DELETE
    // ==================================================

    delete(value) {

        this.lastRotation = null;
        this.rotationNodes = [];

        this.root =
            this.deleteNode(
                this.root,
                value
            );
    }


    deleteNode(node, value) {

        if (node === null) {
            return null;
        }


        // SEARCH LEFT
        if (value < node.value) {

            node.left =
                this.deleteNode(
                    node.left,
                    value
                );
        }


        // SEARCH RIGHT
        else if (value > node.value) {

            node.right =
                this.deleteNode(
                    node.right,
                    value
                );
        }


        // NODE FOUND
        else {

            // NO CHILD
            if (
                node.left === null &&
                node.right === null
            ) {

                return null;
            }


            // RIGHT CHILD
            if (node.left === null) {

                return node.right;
            }


            // LEFT CHILD
            if (node.right === null) {

                return node.left;
            }


            // TWO CHILDREN
            let successor =
                node.right;

            while (
                successor.left !== null
            ) {

                successor =
                    successor.left;
            }


            node.value =
                successor.value;

            node.right =
                this.deleteNode(
                    node.right,
                    successor.value
                );
        }


        this.updateHeight(node);


        const balance =
            this.getBalanceFactor(node);


        // ==================================================
        // LL
        // ==================================================

        if (
            balance > 1 &&
            this.getBalanceFactor(node.left) >= 0
        ) {

            this.lastRotation =
                this.lastRotation || "LL";

            this.rotationNodes =
                this.rotationNodes.length
                    ? this.rotationNodes
                    : [
                        node.value,
                        node.left.value
                    ];

            return this.rightRotate(node);
        }


        // ==================================================
        // LR
        // ==================================================

        if (
            balance > 1 &&
            this.getBalanceFactor(node.left) < 0
        ) {

            this.lastRotation =
                this.lastRotation || "LR";

            this.rotationNodes =
                this.rotationNodes.length
                    ? this.rotationNodes
                    : [
                        node.value,
                        node.left.value
                    ];

            node.left =
                this.leftRotate(
                    node.left
                );

            return this.rightRotate(node);
        }


        // ==================================================
        // RR
        // ==================================================

        if (
            balance < -1 &&
            this.getBalanceFactor(node.right) <= 0
        ) {

            this.lastRotation =
                this.lastRotation || "RR";

            this.rotationNodes =
                this.rotationNodes.length
                    ? this.rotationNodes
                    : [
                        node.value,
                        node.right.value
                    ];

            return this.leftRotate(node);
        }


        // ==================================================
        // RL
        // ==================================================

        if (
            balance < -1 &&
            this.getBalanceFactor(node.right) > 0
        ) {

            this.lastRotation =
                this.lastRotation || "RL";

            this.rotationNodes =
                this.rotationNodes.length
                    ? this.rotationNodes
                    : [
                        node.value,
                        node.right.value
                    ];

            node.right =
                this.rightRotate(
                    node.right
                );

            return this.leftRotate(node);
        }


        return node;
    }
}


// ======================================================
// CREATE TREE
// ======================================================

const avlTree =
    new AVLTree();


// ======================================================
// HTML ELEMENTS
// ======================================================

const valueInput =
    document.getElementById("valueInput");

const insertBtn =
    document.getElementById("insertBtn");

const deleteBtn =
    document.getElementById("deleteBtn");

const clearBtn =
    document.getElementById("clearBtn");

const randomBtn =
    document.getElementById("randomBtn");

const saveBtn =
    document.getElementById("saveBtn");

const loadBtn =
    document.getElementById("loadBtn");

const fileInput =
    document.getElementById("fileInput");

const treeContainer =
    document.getElementById("treeContainer");

const nodeCount =
    document.getElementById("nodeCount");

const treeHeight =
    document.getElementById("treeHeight");

const minValue =
    document.getElementById("minValue");

const maxValue =
    document.getElementById("maxValue");

const inorder =
    document.getElementById("inorder");

const preorder =
    document.getElementById("preorder");

const postorder =
    document.getElementById("postorder");

const levelorder =
    document.getElementById("levelorder");

const historyList =
    document.getElementById("historyList");

const explanationContent =
    document.getElementById(
        "explanationContent"
    );

const traversalStatus =
    document.getElementById(
        "traversalStatus"
    );


// ======================================================
// TOAST
// ======================================================

function showToast(
    message,
    type = "error"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );

    if (!container) {
        return;
    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    container.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);
}


// ======================================================
// EXPLANATION
// ======================================================

function showExplanation(
    title,
    message,
    rotation = null
) {

    let html = `
        <div class="explanation-title">
            ${title}
        </div>

        <div>
            ${message}
        </div>
    `;


    if (rotation) {

        html += `
            <div class="rotation-badge">
                ${rotation} Rotation
            </div>
        `;
    }


    explanationContent.innerHTML =
        html;
}


// ======================================================
// CONTAINS VALUE
// ======================================================

function containsValue(
    node,
    value
) {

    if (node === null) {
        return false;
    }


    if (value === node.value) {
        return true;
    }


    if (value < node.value) {

        return containsValue(
            node.left,
            value
        );
    }


    return containsValue(
        node.right,
        value
    );
}


// ======================================================
// INSERT
// ======================================================

insertBtn.addEventListener(
    "click",
    function () {

        const input =
            valueInput.value.trim();


        if (input === "") {

            showToast(
                "Please enter a value.",
                "warning"
            );

            return;
        }


        const value =
            Number(input);


        if (!Number.isFinite(value)) {

            showToast(
                "Please enter a valid number.",
                "error"
            );

            return;
        }


        if (
            containsValue(
                avlTree.root,
                value
            )
        ) {

            showToast(
                "This value already exists.",
                "error"
            );

            return;
        }


        avlTree.insert(value);


        renderTree();


        addHistory(
            `Inserted ${value}`
        );


        if (avlTree.lastRotation) {

            showExplanation(
                "AVL Tree Rebalanced",
                `Node ${value} was inserted and the tree became unbalanced. The ${avlTree.lastRotation} case was detected and the required rotation was performed.`,
                avlTree.lastRotation
            );


            highlightNodes(
                avlTree.rotationNodes
            );


            showToast(
                `${avlTree.lastRotation} rotation performed.`,
                "success"
            );

        } else {

            showExplanation(
                "Node Inserted",
                `Node ${value} was inserted successfully. The AVL tree remains balanced.`
            );


            showToast(
                `Node ${value} inserted successfully.`,
                "success"
            );
        }


        valueInput.value = "";
    }
);


// ======================================================
// DELETE
// ======================================================

deleteBtn.addEventListener(
    "click",
    function () {

        const input =
            valueInput.value.trim();


        if (input === "") {

            showToast(
                "Enter a value to delete.",
                "warning"
            );

            return;
        }


        const value =
            Number(input);


        if (!Number.isFinite(value)) {

            showToast(
                "Please enter a valid number.",
                "error"
            );

            return;
        }


        if (
            !containsValue(
                avlTree.root,
                value
            )
        ) {

            showToast(
                `Value ${value} was not found.`,
                "error"
            );

            return;
        }


        avlTree.delete(value);


        renderTree();


        addHistory(
            `Deleted ${value}`
        );


        if (avlTree.lastRotation) {

            showExplanation(
                "AVL Tree Rebalanced",
                `Node ${value} was deleted and the tree required rebalancing. The ${avlTree.lastRotation} case was handled automatically.`,
                avlTree.lastRotation
            );


            highlightNodes(
                avlTree.rotationNodes
            );


            showToast(
                `${avlTree.lastRotation} rotation performed after deletion.`,
                "success"
            );

        } else {

            showExplanation(
                "Node Deleted",
                `Node ${value} was deleted successfully. The AVL tree remains balanced.`
            );


            showToast(
                `Node ${value} deleted successfully.`,
                "success"
            );
        }


        valueInput.value = "";
    }
);


// ======================================================
// ENTER KEY
// ======================================================

valueInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            insertBtn.click();
        }
    }
);


// ======================================================
// CLEAR
// ======================================================

clearBtn.addEventListener(
    "click",
    function () {

        if (
            avlTree.root === null
        ) {

            showToast(
                "The AVL tree is already empty.",
                "warning"
            );

            return;
        }


        avlTree.root = null;


        renderTree();


        historyList.innerHTML =
            "<li>No operations yet</li>";


        valueInput.value = "";


        showExplanation(
            "Tree Cleared",
            "All nodes have been removed from the AVL tree."
        );


        showToast(
            "AVL tree cleared.",
            "success"
        );
    }
);


// ======================================================
// RANDOM TREE
// ======================================================

randomBtn.addEventListener(
    "click",
    function () {

        avlTree.root = null;


        const values = [];

        const count =
            Math.floor(
                Math.random() * 6
            ) + 7;


        while (
            values.length < count
        ) {

            const value =
                Math.floor(
                    Math.random() * 99
                ) + 1;


            if (
                !values.includes(value)
            ) {

                values.push(value);
            }
        }


        values.forEach(
            value => {
                avlTree.insert(value);
            }
        );


        renderTree();


        addHistory(
            `Generated random tree with ${count} nodes`
        );


        showExplanation(
            "Random AVL Tree Generated",
            `A balanced AVL tree was generated using ${count} unique values.`
        );


        showToast(
            "Random AVL tree generated.",
            "success"
        );
    }
);


// ======================================================
// SAVE TREE
// ======================================================

saveBtn.addEventListener(
    "click",
    function () {

        if (
            avlTree.root === null
        ) {

            showToast(
                "There is no tree to save.",
                "warning"
            );

            return;
        }


        const values = [];


        collectValues(
            avlTree.root,
            values
        );


        const data = {

            type: "AVL Tree",

            values: values,

            createdAt:
                new Date().toISOString()
        };


        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "avl-tree.json";

        link.click();


        URL.revokeObjectURL(url);


        addHistory(
            "Saved AVL tree"
        );


        showToast(
            "AVL tree saved successfully.",
            "success"
        );
    }
);


// ======================================================
// LOAD TREE BUTTON
// ======================================================

loadBtn.addEventListener(
    "click",
    function () {

        fileInput.click();
    }
);


// ======================================================
// LOAD JSON FILE
// ======================================================

fileInput.addEventListener(
    "change",
    function () {

        const file =
            fileInput.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    if (
                        !data.values ||
                        !Array.isArray(
                            data.values
                        )
                    ) {

                        throw new Error(
                            "Invalid file"
                        );
                    }


                    avlTree.root = null;


                    const uniqueValues =
                        [
                            ...new Set(
                                data.values
                            )
                        ];


                    uniqueValues.forEach(
                        value => {

                            if (
                                Number.isFinite(
                                    Number(value)
                                )
                            ) {

                                avlTree.insert(
                                    Number(value)
                                );
                            }
                        }
                    );


                    renderTree();


                    addHistory(
                        "Loaded AVL tree from file"
                    );


                    showExplanation(
                        "Tree Loaded",
                        `The saved AVL tree was loaded successfully with ${uniqueValues.length} nodes.`
                    );


                    showToast(
                        "AVL tree loaded successfully.",
                        "success"
                    );


                } catch (error) {

                    showToast(
                        "Invalid AVL tree file.",
                        "error"
                    );
                }


                fileInput.value = "";
            };


        reader.readAsText(file);
    }
);


// ======================================================
// RENDER TREE
// ======================================================

function renderTree() {

    if (
        avlTree.root === null
    ) {

        treeContainer.innerHTML = `
            <p class="empty-message">
                Your AVL tree will appear here
            </p>
        `;


        updateStatistics();


        inorder.textContent = "-";
        preorder.textContent = "-";
        postorder.textContent = "-";
        levelorder.textContent = "-";


        return;
    }


    treeContainer.innerHTML = "";


    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.setAttribute(
        "width",
        "100%"
    );


    svg.setAttribute(
        "height",
        "430"
    );


    svg.setAttribute(
        "viewBox",
        "0 0 1000 430"
    );


    const positions = [];


    calculatePositions(
        avlTree.root,
        500,
        65,
        250,
        positions
    );


    // Draw branches
    positions.forEach(
        item => {

            if (
                item.node.left !== null
            ) {

                const child =
                    positions.find(
                        p =>
                            p.node ===
                            item.node.left
                    );


                drawLine(
                    svg,
                    item.x,
                    item.y,
                    child.x,
                    child.y
                );
            }


            if (
                item.node.right !== null
            ) {

                const child =
                    positions.find(
                        p =>
                            p.node ===
                            item.node.right
                    );


                drawLine(
                    svg,
                    item.x,
                    item.y,
                    child.x,
                    child.y
                );
            }
        }
    );


    // Draw nodes
    positions.forEach(
        item => {

            drawNode(
                svg,
                item.x,
                item.y,
                item.node
            );
        }
    );


    treeContainer.appendChild(svg);


    updateStatistics();

    updateTraversals();
}


// ======================================================
// CALCULATE POSITIONS
// ======================================================

function calculatePositions(
    node,
    x,
    y,
    horizontalGap,
    positions
) {

    if (node === null) {
        return;
    }


    positions.push({

        node: node,

        x: x,

        y: y
    });


    if (
        node.left !== null
    ) {

        calculatePositions(
            node.left,
            x - horizontalGap,
            y + 90,
            horizontalGap / 2,
            positions
        );
    }


    if (
        node.right !== null
    ) {

        calculatePositions(
            node.right,
            x + horizontalGap,
            y + 90,
            horizontalGap / 2,
            positions
        );
    }
}


// ======================================================
// DRAW BRANCH
// ======================================================

function drawLine(
    svg,
    x1,
    y1,
    x2,
    y2
) {

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        x1
    );


    line.setAttribute(
        "y1",
        y1 + 28
    );


    line.setAttribute(
        "x2",
        x2
    );


    line.setAttribute(
        "y2",
        y2 - 28
    );


    line.setAttribute(
        "stroke",
        "#8A6848"
    );


    line.setAttribute(
        "stroke-width",
        "3"
    );


    svg.appendChild(line);
}


// ======================================================
// DRAW NODE
// ======================================================

function drawNode(
    svg,
    x,
    y,
    node
) {

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    group.classList.add(
        "avl-node"
    );


    group.dataset.value =
        node.value;


    // Circle
    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    circle.setAttribute(
        "cx",
        x
    );


    circle.setAttribute(
        "cy",
        y
    );


    circle.setAttribute(
        "r",
        "28"
    );


    circle.setAttribute(
        "fill",
        "#4F8060"
    );


    circle.setAttribute(
        "stroke",
        "#ffffff"
    );


    circle.setAttribute(
        "stroke-width",
        "3"
    );


    circle.style.filter =
        "drop-shadow(0 4px 5px rgba(60,110,130,0.25))";


    group.appendChild(circle);


    // Value
    const text =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    text.setAttribute(
        "x",
        x
    );


    text.setAttribute(
        "y",
        y + 6
    );


    text.setAttribute(
        "text-anchor",
        "middle"
    );


    text.setAttribute(
        "font-size",
        "17"
    );


    text.setAttribute(
        "font-weight",
        "bold"
    );


    text.setAttribute(
        "fill",
        "#ffffff"
    );


    text.textContent =
        node.value;


    group.appendChild(text);


    // Balance factor
    const balance =
        avlTree.getBalanceFactor(
            node
        );


    const balanceText =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    balanceText.setAttribute(
        "x",
        x
    );


    balanceText.setAttribute(
        "y",
        y + 48
    );


    balanceText.setAttribute(
        "text-anchor",
        "middle"
    );


    balanceText.setAttribute(
        "font-size",
        "13"
    );


    balanceText.setAttribute(
        "font-weight",
        "bold"
    );


    balanceText.setAttribute(
        "fill",
        "#527589"
    );


    balanceText.textContent =
        `BF: ${balance}`;


    group.appendChild(
        balanceText
    );


    svg.appendChild(group);
}


// ======================================================
// HIGHLIGHT ROTATION NODES
// ======================================================

function highlightNodes(
    values
) {

    if (!values ||
        values.length === 0) {

        return;
    }


    const nodes =
        document.querySelectorAll(
            ".avl-node"
        );


    nodes.forEach(
        node => {

            const value =
                Number(
                    node.dataset.value
                );


            if (
                values.includes(value)
            ) {

                node.classList.add(
                    "highlighted"
                );
            }
        }
    );


    setTimeout(() => {

        nodes.forEach(
            node => {

                node.classList.remove(
                    "highlighted"
                );
            }
        );

    }, 1800);
}


// ======================================================
// STATISTICS
// ======================================================

function updateStatistics() {

    const values = [];


    collectValues(
        avlTree.root,
        values
    );


    nodeCount.textContent =
        values.length;


    treeHeight.textContent =
        avlTree.getHeight(
            avlTree.root
        );


    if (
        values.length > 0
    ) {

        minValue.textContent =
            Math.min(
                ...values
            );


        maxValue.textContent =
            Math.max(
                ...values
            );

    } else {

        minValue.textContent =
            "-";

        maxValue.textContent =
            "-";
    }
}


// ======================================================
// COLLECT VALUES
// ======================================================

function collectValues(
    node,
    values
) {

    if (node === null) {
        return;
    }


    values.push(
        node.value
    );


    collectValues(
        node.left,
        values
    );


    collectValues(
        node.right,
        values
    );
}


// ======================================================
// INORDER
// ======================================================

function getInorder(
    node,
    result
) {

    if (node === null) {
        return;
    }


    getInorder(
        node.left,
        result
    );


    result.push(
        node.value
    );


    getInorder(
        node.right,
        result
    );
}


// ======================================================
// PREORDER
// ======================================================

function getPreorder(
    node,
    result
) {

    if (node === null) {
        return;
    }


    result.push(
        node.value
    );


    getPreorder(
        node.left,
        result
    );


    getPreorder(
        node.right,
        result
    );
}


// ======================================================
// POSTORDER
// ======================================================

function getPostorder(
    node,
    result
) {

    if (node === null) {
        return;
    }


    getPostorder(
        node.left,
        result
    );


    getPostorder(
        node.right,
        result
    );


    result.push(
        node.value
    );
}


// ======================================================
// LEVEL ORDER
// ======================================================

function getLevelOrder(
    root
) {

    if (root === null) {
        return [];
    }


    const queue = [
        root
    ];

    const result = [];


    while (
        queue.length > 0
    ) {

        const current =
            queue.shift();


        result.push(
            current.value
        );


        if (
            current.left !== null
        ) {

            queue.push(
                current.left
            );
        }


        if (
            current.right !== null
        ) {

            queue.push(
                current.right
            );
        }
    }


    return result;
}


// ======================================================
// UPDATE TRAVERSALS
// ======================================================

function updateTraversals() {

    const inResult = [];

    const preResult = [];

    const postResult = [];


    getInorder(
        avlTree.root,
        inResult
    );


    getPreorder(
        avlTree.root,
        preResult
    );


    getPostorder(
        avlTree.root,
        postResult
    );


    const levelResult =
        getLevelOrder(
            avlTree.root
        );


    inorder.textContent =
        inResult.join("  ");


    preorder.textContent =
        preResult.join("  ");


    postorder.textContent =
        postResult.join("  ");


    levelorder.textContent =
        levelResult.join("  ");
}


// ======================================================
// TRAVERSAL VISUALIZATION
// ======================================================

function visualizeTraversal(
    type
) {

    if (
        avlTree.root === null
    ) {

        showToast(
            "Create a tree first.",
            "warning"
        );

        return;
    }


    let values = [];


    if (
        type === "inorder"
    ) {

        getInorder(
            avlTree.root,
            values
        );
    }


    if (
        type === "preorder"
    ) {

        getPreorder(
            avlTree.root,
            values
        );
    }


    if (
        type === "postorder"
    ) {

        getPostorder(
            avlTree.root,
            values
        );
    }


    if (
        type === "levelorder"
    ) {

        values =
            getLevelOrder(
                avlTree.root
            );
    }


    const nodes =
        document.querySelectorAll(
            ".avl-node"
        );


    nodes.forEach(
        node => {

            node.classList.remove(
                "traversal-active"
            );
        }
    );


    let index = 0;


    traversalStatus.textContent =
        `Visualizing ${formatTraversalName(type)}...`;


    function highlightNext() {

        if (
            index >= values.length
        ) {

            traversalStatus.textContent =
                `${formatTraversalName(type)} traversal completed.`;

            return;
        }


        nodes.forEach(
            node => {

                node.classList.remove(
                    "traversal-active"
                );
            }
        );


        const currentValue =
            values[index];


        const currentNode =
            document.querySelector(
                `.avl-node[data-value="${currentValue}"]`
            );


        if (currentNode) {

            currentNode.classList.add(
                "traversal-active"
            );
        }


        traversalStatus.textContent =
            `${formatTraversalName(type)}: visiting ${currentValue} (${index + 1}/${values.length})`;


        index++;


        setTimeout(
            highlightNext,
            700
        );
    }


    highlightNext();
}


// ======================================================
// TRAVERSAL NAME
// ======================================================

function formatTraversalName(
    type
) {

    const names = {

        inorder: "Inorder",

        preorder: "Preorder",

        postorder: "Postorder",

        levelorder: "Level Order"
    };


    return names[type] ||
        "Traversal";
}


// ======================================================
// TRAVERSAL BUTTONS
// ======================================================

document
    .getElementById(
        "visualizeInorder"
    )
    .addEventListener(
        "click",
        () => {
            visualizeTraversal(
                "inorder"
            );
        }
    );


document
    .getElementById(
        "visualizePreorder"
    )
    .addEventListener(
        "click",
        () => {
            visualizeTraversal(
                "preorder"
            );
        }
    );


document
    .getElementById(
        "visualizePostorder"
    )
    .addEventListener(
        "click",
        () => {
            visualizeTraversal(
                "postorder"
            );
        }
    );


document
    .getElementById(
        "visualizeLevelorder"
    )
    .addEventListener(
        "click",
        () => {
            visualizeTraversal(
                "levelorder"
            );
        }
    );


// ======================================================
// OPERATION HISTORY
// ======================================================

function addHistory(
    message
) {

    if (
        historyList.children.length === 1 &&
        historyList.children[0]
            .textContent ===
        "No operations yet"
    ) {

        historyList.innerHTML = "";
    }


    const item =
        document.createElement("li");


    item.textContent =
        message;


    historyList.prepend(
        item
    );


    // Keep history manageable
    while (
        historyList.children.length > 12
    ) {

        historyList.removeChild(
            historyList.lastChild
        );
    }
}


// ======================================================
// INITIAL DISPLAY
// ======================================================

renderTree();

showExplanation(
    "Ready to Explore",
    "Insert or delete a node to see AVL balancing, rotations and step-by-step explanations."
);