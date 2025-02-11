async function generateName() {
    const keywords = document.getElementById("keywords").value.trim();
    if (!keywords) {
        alert("Please enter some keywords!");
        return;
    }

    const response = await fetch("/.netlify/functions/generate-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords })
    });

    if (!response.ok) {
        alert("Error: API request failed! Check your API key or try again later.");
        return;
    }

    const data = await response.json();
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (data.names) {
        data.names.forEach((name, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<span class="font-semibold">${index + 1}.</span> ${name.replace(/\*\*/g, "").trim()}`;
            li.classList.add("p-3", "bg-gray-200", "rounded-md", "shadow-sm");
            results.appendChild(li);
        });
    } else {
        results.innerHTML = "<li class='text-red-500'>Error generating names. Try again.</li>";
    }
}
