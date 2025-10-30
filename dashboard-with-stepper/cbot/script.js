let knowledgeBase = {};

async function loadCSV() {
    try {
        let response = await fetch("timetable_QA_dataset_full.csv");
        let csvText = await response.text();
        let rows = csvText.split("\n").slice(1);

        rows.forEach(row => {
            let columns = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
            if (columns && columns.length >= 2) {
                let question = columns[0].replace(/"/g, "").trim().toLowerCase();
                let answer = columns.slice(1).join(",").replace(/"/g, "").trim();
                knowledgeBase[question] = answer;
            }
        });

    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

window.onload = loadCSV;

function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chat-box");

    let userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    userMessage.innerText = userInput;
    chatBox.appendChild(userMessage);

    document.getElementById("user-input").value = "";

    setTimeout(() => {
        let botResponse = document.createElement("div");
        botResponse.classList.add("message", "bot");
        botResponse.innerText = getBotResponse(userInput);
        chatBox.appendChild(botResponse);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}

function getBotResponse(input) {
    if (Object.keys(knowledgeBase).length === 0) {
        return "Knowledge base is still loading...";
    }

    let cleanedInput = input.toLowerCase().trim();
    return knowledgeBase[cleanedInput] || findClosestMatch(cleanedInput);
}

function findClosestMatch(input) {
    let bestMatch = "";
    let highestSimilarity = 0;

    for (let storedQuestion in knowledgeBase) {
        let similarityScore = calculateSimilarity(input, storedQuestion);
        if (similarityScore > highestSimilarity) {
            highestSimilarity = similarityScore;
            bestMatch = storedQuestion;
        }
    }

    return highestSimilarity > 0.3 ? knowledgeBase[bestMatch] : "I couldn't find an answer. Try rephrasing!";
}

function calculateSimilarity(input, storedQuestion) {
    let inputWords = input.toLowerCase().split(/\s+/);
    let storedWords = storedQuestion.toLowerCase().split(/\s+/);
    
    let commonWords = inputWords.filter(word => storedWords.includes(word)).length;
    return commonWords / Math.max(inputWords.length, storedWords.length);
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}